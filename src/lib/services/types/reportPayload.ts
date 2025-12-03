import type { ReportRequest, SafetyAnalysisResult } from '@/types/api';
import type { EnvironmentalInsights } from '@/lib/services/environmentService';
import type { AISafetyReport } from '@/lib/services/aiService';

export interface ReportPayloadMetadata {
    missingCoordinates?: boolean;
    missingSchedule?: boolean;
    sanitizedAt?: string;
    issues?: string[];
}

export type ReportPayload = Omit<ReportRequest, 'location'> & {
    location: ReportRequest['location'] & { weatherStationId?: number };
    notes?: string;
    companions?: ReportRequest['companions'];
    safety_analysis?: SafetyAnalysisResult;
    environmental_data?: EnvironmentalInsights;
    ai_report?: AISafetyReport | null;
    metadata?: ReportPayloadMetadata;
    [key: string]: unknown;
};
