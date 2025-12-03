import { analyzeSafety, SAFETY_ANALYSIS_VERSION } from '@/lib/services/safetyService';
import { fetchEnvironmentalInsights } from '@/lib/services/environmentService';
import { generateSafetyReport, type AISafetyReport } from '@/lib/services/aiService';
import type { ReportRequest, SafetyAnalysisResult } from '@/types/api';
import type { MarineWeather } from '@/lib/services/weatherService';
import type { WeatherWarning, CoastGuardStation } from '@/lib/services/publicDataService';
import type { ReportPayload } from '@/lib/services/types/reportPayload';
import { normalizeReportPayload } from '@/lib/utils/reportPayload';

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


const needNewEnvironmentalData = (payload: ReportPayload): boolean => {
    if (!payload.environmental_data) return true;
    const fetchedAt = payload.environmental_data?.fetchedAt;
    if (!fetchedAt) return true;
    const ageMs = Date.now() - new Date(fetchedAt).getTime();
    const maxAgeMs = 10 * 60 * 1000; // 10 minutes TTL
    return ageMs > maxAgeMs;
};

export const buildReportInsights = async (report: { location_data?: unknown }): Promise<ReportInsightComputation> => {
    const { payload, changed: normalizedChanged } = normalizeReportPayload(report?.location_data);
    const location = payload.location;
    const activity = payload.activity;
    const contact = payload.contact;

    if (!location || !activity || !contact) {
        throw new Error('Invalid report payload. Missing location/activity/contact data.');
    }

    let changed = normalizedChanged;

    const hasValidCoordinates =
        !payload.metadata?.missingCoordinates &&
        Number.isFinite(location.coordinates.latitude) &&
        Number.isFinite(location.coordinates.longitude);

    let environmentalData = payload.environmental_data;
    let envUpdated = false;
    if (hasValidCoordinates) {
        if (!environmentalData || needNewEnvironmentalData(payload)) {
            environmentalData = await fetchEnvironmentalInsights({
                lat: location.coordinates.latitude,
                lon: location.coordinates.longitude,
                warningStationId: location.weatherStationId,
            });
            envUpdated = true;
            changed = true;
        }
    } else if (!environmentalData) {
        environmentalData = {
            weather: null,
            warnings: [],
            stations: [],
            fetchedAt: new Date().toISOString(),
        };
    }

    const weather = environmentalData?.weather ?? null;
    const warnings = environmentalData?.warnings ?? [];
    const stations = environmentalData?.stations ?? [];

    const cachedAnalysis = payload.safety_analysis;
    const needsRecompute =
        !cachedAnalysis ||
        envUpdated ||
        cachedAnalysis.version !== SAFETY_ANALYSIS_VERSION;

    let safetyAnalysis: SafetyAnalysisResult;
    if (needsRecompute) {
        safetyAnalysis = await analyzeSafety(
            {
                location,
                activity,
                contact,
                companions: payload.companions,
                notes: payload.notes,
            } as ReportRequest,
            { weather, warnings, stations }
        );
        changed = true;
    } else {
        safetyAnalysis = cachedAnalysis;
    }

    const canUseAi = hasValidCoordinates && !payload.metadata?.missingSchedule;

    let aiReport: AISafetyReport | null | undefined = payload.ai_report;
    if (!aiReport && canUseAi) {
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
        ai_report: canUseAi ? aiReport ?? null : null,
    };

    return {
        insights: {
            safetyAnalysis,
            weather,
            warnings,
            stations,
            aiReport: canUseAi ? aiReport ?? null : null,
        },
        updatedPayload,
        changed,
    };
};
