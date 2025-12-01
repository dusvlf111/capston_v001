import { analyzeSafety } from '@/lib/services/safetyService';
import { fetchEnvironmentalInsights, type EnvironmentalInsights } from '@/lib/services/environmentService';
import { generateSafetyReport, type AISafetyReport } from '@/lib/services/aiService';
import type { ReportRequest, SafetyAnalysisResult } from '@/types/api';
import type { MarineWeather } from '@/lib/services/weatherService';
import type { WeatherWarning, CoastGuardStation } from '@/lib/services/publicDataService';

export interface ReportInsights {
    weather: MarineWeather | null;
    warnings: WeatherWarning[];
    stations: CoastGuardStation[];
    safetyAnalysis: SafetyAnalysisResult;
    aiReport: AISafetyReport | null;
}

export interface ReportInsightComputation {
    insights: ReportInsights;
    updatedPayload: ReportPayload;
    changed: boolean;
}

export type ReportPayload = Omit<ReportRequest, 'location'> & {
    location: ReportRequest['location'] & { weatherStationId?: number };
    notes?: string;
    companions?: ReportRequest['companions'];
    safety_analysis?: SafetyAnalysisResult;
    environmental_data?: EnvironmentalInsights;
    ai_report?: AISafetyReport | null;
    [key: string]: unknown;
};

const needNewEnvironmentalData = (payload: ReportPayload): boolean => {
    if (!payload.environmental_data) return true;
    const fetchedAt = payload.environmental_data?.fetchedAt;
    if (!fetchedAt) return true;
    const ageMs = Date.now() - new Date(fetchedAt).getTime();
    const maxAgeMs = 10 * 60 * 1000; // 10 minutes TTL
    return ageMs > maxAgeMs;
};

export const buildReportInsights = async (report: { location_data?: ReportPayload }): Promise<ReportInsightComputation> => {
    const payload: ReportPayload = { ...(report?.location_data || {}) } as ReportPayload;
    const location = payload.location;
    const activity = payload.activity;
    const contact = payload.contact;

    if (!location || !activity || !contact) {
        throw new Error('Invalid report payload. Missing location/activity/contact data.');
    }

    // Reuse stored analysis when present
    let safetyAnalysis: SafetyAnalysisResult | undefined = payload.safety_analysis;
    let changed = false;

    if (!safetyAnalysis) {
        safetyAnalysis = await analyzeSafety({
            location,
            activity,
            contact,
            companions: payload.companions,
            notes: payload.notes,
        });
        changed = true;
    }

    let environmentalData = payload.environmental_data;
    if (!environmentalData || needNewEnvironmentalData(payload)) {
        environmentalData = await fetchEnvironmentalInsights({
            lat: location.coordinates.latitude,
            lon: location.coordinates.longitude,
            warningStationId: location.weatherStationId,
        });
        changed = true;
    }

    const weather = environmentalData?.weather ?? null;
    const warnings = environmentalData?.warnings ?? [];
    const stations = environmentalData?.stations ?? [];

    let aiReport: AISafetyReport | null | undefined = payload.ai_report;
    if (!aiReport) {
        aiReport = await generateSafetyReport(
            { location, activity, contact, companions: payload.companions } as ReportRequest,
            weather,
            warnings,
            stations
        );
        changed = true;
    }

    const updatedPayload = {
        ...payload,
        safety_analysis: safetyAnalysis,
        environmental_data: environmentalData,
        ai_report: aiReport,
    };

    return {
        insights: {
            safetyAnalysis,
            weather,
            warnings,
            stations,
            aiReport,
        },
        updatedPayload,
        changed,
    };
};
