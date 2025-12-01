import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildReportInsights, type ReportPayload } from '../reportInsightsService';
import { analyzeSafety } from '../safetyService';
import { fetchEnvironmentalInsights } from '../environmentService';
import { generateSafetyReport } from '../aiService';

vi.mock('../safetyService', () => ({
    analyzeSafety: vi.fn(),
}));

vi.mock('../environmentService', () => ({
    fetchEnvironmentalInsights: vi.fn(),
}));

vi.mock('../aiService', () => ({
    generateSafetyReport: vi.fn(),
}));

const mockSafety = analyzeSafety as unknown as ReturnType<typeof vi.fn>;
const mockEnv = fetchEnvironmentalInsights as unknown as ReturnType<typeof vi.fn>;
const mockAI = generateSafetyReport as unknown as ReturnType<typeof vi.fn>;

const basePayload: ReportPayload = {
    location: {
        name: '해운대',
        coordinates: { latitude: 35.16, longitude: 129.16 },
    },
    activity: {
        type: '패들보드',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        participants: 2,
    },
    contact: {
        name: '홍길동',
        phone: '010-1234-5678',
        emergencyContact: '010-9876-5432',
    },
};

describe('buildReportInsights', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSafety.mockResolvedValue({
            score: 88,
            level: 'GREEN',
            risk_factors: [],
            recommendations: [],
        });
        mockEnv.mockResolvedValue({
            weather: { time: new Date().toISOString(), wind_speed: 5, wind_direction: 180, wind_gusts: 7, wave_height: 0.8, swell_wave_height: 0.3, provider: 'windy' },
            warnings: [],
            stations: [],
            fetchedAt: new Date().toISOString(),
        });
        mockAI.mockResolvedValue({
            summary: '안전',
            riskLevel: 'LOW',
            riskFactors: [],
            recommendations: [],
            weatherAnalysis: '정온',
        });
    });

    it('computes insights when payload lacks cached data', async () => {
        const { insights, updatedPayload, changed } = await buildReportInsights({ location_data: basePayload });

        expect(changed).toBe(true);
        expect(insights.weather?.provider).toBe('windy');
        expect(updatedPayload.ai_report?.summary).toBe('안전');
        expect(mockSafety).toHaveBeenCalledTimes(1);
        expect(mockEnv).toHaveBeenCalledTimes(1);
        expect(mockAI).toHaveBeenCalledTimes(1);
    });

    it('reuses cached data when available', async () => {
        const cachedPayload: ReportPayload = {
            ...basePayload,
            safety_analysis: {
                score: 90,
                level: 'GREEN',
                risk_factors: [],
                recommendations: [],
            },
            environmental_data: {
                weather: { time: new Date().toISOString(), wind_speed: 4, wind_direction: 100, wind_gusts: 6, wave_height: 0.5, swell_wave_height: 0.2, provider: 'windy' },
                warnings: [],
                stations: [],
                fetchedAt: new Date().toISOString(),
            },
            ai_report: {
                summary: '정상 운영',
                riskLevel: 'LOW',
                riskFactors: [],
                recommendations: [],
                weatherAnalysis: '맑음',
            },
        };

        const { changed } = await buildReportInsights({ location_data: cachedPayload });

        expect(changed).toBe(false);
        expect(mockSafety).not.toHaveBeenCalled();
        expect(mockEnv).not.toHaveBeenCalled();
        expect(mockAI).not.toHaveBeenCalled();
    });
});
