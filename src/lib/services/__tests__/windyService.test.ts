import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import { fetchWindyPointForecast } from '../windyService';

const originalEnv = process.env.WINDY_POINT_FORECAST_KEY;

vi.mock('axios', () => {
    const post = vi.fn();
    return {
        default: {
            post,
        },
        isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
    };
});

const mockedAxios = axios as unknown as {
    post: ReturnType<typeof vi.fn>;
};

describe('windyService.fetchWindyPointForecast', () => {
    beforeEach(() => {
        mockedAxios.post.mockReset();
        process.env.WINDY_POINT_FORECAST_KEY = 'test-key';
    });

    afterEach(() => {
        if (originalEnv === undefined) {
            delete process.env.WINDY_POINT_FORECAST_KEY;
        } else {
            process.env.WINDY_POINT_FORECAST_KEY = originalEnv;
        }
    });

    it('returns null when API key is missing', async () => {
        delete process.env.WINDY_POINT_FORECAST_KEY;

        const result = await fetchWindyPointForecast(35.1, 129.2);

        expect(result).toBeNull();
        expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('rejects invalid coordinates', async () => {
        const result = await fetchWindyPointForecast(Number.NaN, 129.2);

        expect(result).toBeNull();
        expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('sends sanitized payload to Windy', async () => {
        mockedAxios.post.mockResolvedValue({ data: { ok: true } });

        const result = await fetchWindyPointForecast(35.123456, 129.987654);

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        const [, payload] = mockedAxios.post.mock.calls[0];
        expect(payload).toMatchObject({
            key: 'test-key',
            lat: 35.123,
            lon: 129.988,
            parameters: ['wind', 'windGust'],
            units: 'metric',
        });
        expect(result).toEqual({ ok: true });
    });

    it('returns null when Windy responds with an error', async () => {
        mockedAxios.post.mockRejectedValue({
            isAxiosError: true,
            response: { status: 400, data: { message: 'bad request' } },
        });

        const result = await fetchWindyPointForecast(35.1, 129.2);

        expect(result).toBeNull();
    });
});
