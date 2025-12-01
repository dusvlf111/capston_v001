import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateSafetyReport } from '../aiService';
import type { ReportRequest } from '@/types/api';

const { mockCreate } = vi.hoisted(() => ({
    mockCreate: vi.fn(),
}));

vi.mock('openai', () => {
    class MockOpenAI {
        chat;

        constructor() {
            this.chat = {
                completions: {
                    create: mockCreate,
                },
            };
        }
    }

    return {
        default: MockOpenAI,
    };
});

const baseReport: ReportRequest = {
    location: {
        name: '해운대',
        coordinates: { latitude: 35.16, longitude: 129.16 },
    },
    activity: {
        type: '패들보드',
        startTime: '2025-12-01T10:00:00Z',
        endTime: '2025-12-01T12:00:00Z',
        participants: 2,
    },
    contact: {
        name: '홍길동',
        phone: '010-1234-5678',
        emergencyContact: '010-9876-5432',
    },
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('generateSafetyReport', () => {
    it('returns null when API key is missing', async () => {
        delete process.env.OPENAI_API_KEY;
        const result = await generateSafetyReport(baseReport, null, [], []);
        expect(result).toBeNull();
        expect(mockCreate).not.toHaveBeenCalled();
    });

    it('parses JSON result from OpenAI', async () => {
        process.env.OPENAI_API_KEY = 'test-key';
        mockCreate.mockResolvedValue({
            choices: [
                {
                    message: {
                        content: JSON.stringify({
                            summary: '이어지는 활동은 안전합니다.',
                            riskLevel: 'LOW',
                            riskFactors: ['가벼운 바람'],
                            recommendations: ['출항 전 장비 점검'],
                            weatherAnalysis: '바람 5m/s',
                        }),
                    },
                },
            ],
        });

        const result = await generateSafetyReport(baseReport, null, [], []);
        expect(result?.riskLevel).toBe('LOW');
        expect(mockCreate).toHaveBeenCalledTimes(1);
    });
});
