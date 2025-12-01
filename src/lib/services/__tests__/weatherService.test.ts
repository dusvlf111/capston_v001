import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import { fetchMarineWeather, __resetWeatherCache } from '../weatherService';
import { fetchWindyPointForecast } from '../windyService';

vi.mock('../windyService', () => ({
    fetchWindyPointForecast: vi.fn(),
}));

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

const mockedAxios = axios as unknown as {
    get: ReturnType<typeof vi.fn>;
};
const mockedWindy = fetchWindyPointForecast as unknown as ReturnType<typeof vi.fn>;

describe('weatherService.fetchMarineWeather', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        __resetWeatherCache();
    });

    afterEach(() => {
        __resetWeatherCache();
    });

    it('returns parsed data from Windy response', async () => {
        const ts = Math.floor(Date.now() / 1000);
        mockedWindy.mockResolvedValue({
            ts: [ts],
            'wind_u-surface': [3],
            'wind_v-surface': [4],
            'gust-surface': [10],
            'waves_height-surface': [1.2],
            'swell_height-surface': [0.5],
        });

        const result = await fetchMarineWeather(35.15, 129.15);

        expect(mockedWindy).toHaveBeenCalledTimes(1);
        expect(result?.provider).toBe('windy');
        expect(result?.wind_speed).toBeCloseTo(5); // 3-4-5 triangle
        expect(result?.wave_height).toBeCloseTo(1.2);
        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('falls back to Open-Meteo when Windy data is unavailable', async () => {
        mockedWindy.mockResolvedValue(null);
        mockedAxios.get
            .mockResolvedValueOnce({ data: { current: { wind_speed_10m: 2, wind_direction_10m: 180, wind_gusts_10m: 4 } } })
            .mockResolvedValueOnce({ data: { current: { wave_height: 0.3, swell_wave_height: 0.1 } } });

        const result = await fetchMarineWeather(35.0, 128.0);

        expect(mockedWindy).toHaveBeenCalledTimes(1);
        expect(result?.provider).toBe('open-meteo');
        expect(result?.wave_height).toBe(0.3);
    });

    it('caches results for nearby coordinates', async () => {
        const ts = Math.floor(Date.now() / 1000);
        mockedWindy.mockResolvedValue({
            ts: [ts],
            'wind_u-surface': [1],
            'wind_v-surface': [0],
            'gust-surface': [2],
            'waves_height-surface': [0.4],
            'swell_height-surface': [0.2],
        });

        const first = await fetchMarineWeather(35.1234, 129.9876);
        const second = await fetchMarineWeather(35.1239, 129.9871);

        expect(mockedWindy).toHaveBeenCalledTimes(1);
        expect(first).toEqual(second);
    });
});
