import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import {
    fetchWeatherWarnings,
    fetchCoastGuardStations,
    __resetPublicDataCache,
} from '../publicDataService';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

const mockedAxios = axios as unknown as {
    get: ReturnType<typeof vi.fn>;
};

describe('publicDataService', () => {
    beforeEach(() => {
        __resetPublicDataCache();
        mockedAxios.get.mockReset();
    });

    it('fetches and normalizes weather warnings', async () => {
        process.env.DATA_PORTAL_API_KEY = 'encoded%2Bkey';
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                response: {
                    body: {
                        items: {
                            item: {
                                title: '태풍 주의보',
                                warnVar: '강풍',
                                tmFc: '202501011200',
                            },
                        },
                    },
                },
            },
        });

        const warnings = await fetchWeatherWarnings(159);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(warnings).toHaveLength(1);
        expect(warnings[0].title).toBe('태풍 주의보');
        expect(warnings[0].tmFc).toMatch(/2025/);

        // Cached call should not hit API again
        const cached = await fetchWeatherWarnings(159);
        expect(cached).toHaveLength(1);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('fetches and sorts coast guard stations by distance', async () => {
        process.env.DATA_PORTAL_API_KEY = 'test-key';
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                response: {
                    body: {
                        items: {
                            item: [
                                { stationNm: '부산해경', tel: '051-111-1111', lat: '35.1', lon: '129.1' },
                                { stationNm: '제주해경', tel: '064-111-1111', lat: '33.5', lon: '126.5' },
                            ],
                        },
                    },
                },
            },
        });

        const stations = await fetchCoastGuardStations(35.15, 129.15);

        expect(stations[0].name).toBe('부산해경');
        expect(stations[0].distance).toBeLessThan(stations[1].distance ?? Infinity);
    });

    it('falls back to static list when API key is missing', async () => {
        delete process.env.DATA_PORTAL_API_KEY;

        const stations = await fetchCoastGuardStations();

        expect(stations.length).toBeGreaterThan(0);
        expect(mockedAxios.get).not.toHaveBeenCalled();
    });
});
