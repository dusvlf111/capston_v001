import axios from 'axios';
import { fetchWindyPointForecast, WindyPointForecastResponse } from './windyService';

export interface MarineWeather {
    time: string;
    wave_height: number;
    swell_wave_height: number;
    wind_speed: number;
    wind_direction: number;
    wind_gusts: number;
    provider?: 'windy' | 'open-meteo' | 'unknown';
}

type CacheEntry<T> = {
    expiresAt: number;
    data: T;
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const weatherCache = new Map<string, CacheEntry<MarineWeather | null>>();

const roundCoordinate = (value: number): number => Number(value.toFixed(2));
const cacheKeyFor = (lat: number, lon: number): string => `${roundCoordinate(lat)}:${roundCoordinate(lon)}`;

const pickClosestIndex = (timestamps: number[]): number => {
    if (timestamps.length === 0) return 0;
    const now = Date.now() / 1000;
    return timestamps.reduce((closestIdx, ts, idx) => {
        const closestDiff = Math.abs(timestamps[closestIdx] - now);
        const diff = Math.abs(ts - now);
        return diff < closestDiff ? idx : closestIdx;
    }, 0);
};

const toNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
};

const getSeriesValue = (series: unknown, index: number): number | undefined => {
    if (!Array.isArray(series)) return undefined;
    return toNumber(series[index]);
};

const calculateWindVector = (u?: number, v?: number) => {
    if (u === undefined || v === undefined) {
        return { speed: 0, direction: 0 };
    }

    const speed = Math.sqrt(u * u + v * v);
    // Convert to meteorological degrees (0° = north, clockwise)
    const direction = (Math.atan2(u, v) * (180 / Math.PI) + 360) % 360;
    return { speed, direction };
};

const mapWindyToMarineWeather = (data: WindyPointForecastResponse): MarineWeather | null => {
    const timestamps = Array.isArray(data?.ts) ? data.ts as number[] : undefined;
    if (!timestamps || timestamps.length === 0) {
        return null;
    }

    const index = pickClosestIndex(timestamps);
    const windU = getSeriesValue(data['wind_u-surface'], index);
    const windV = getSeriesValue(data['wind_v-surface'], index);
    const gust = getSeriesValue(data['gust-surface'], index) ?? 0;
    const waves = getSeriesValue(data['waves_height-surface'], index) ?? 0;
    const swellSeries = data['swell1_height-surface'] ?? data['swell_height-surface'];
    const swell = getSeriesValue(swellSeries, index) ?? 0;
    const { speed, direction } = calculateWindVector(windU, windV);

    return {
        time: new Date((timestamps[index] ?? Date.now() / 1000) * 1000).toISOString(),
        wave_height: waves,
        swell_wave_height: swell,
        wind_speed: speed,
        wind_direction: direction,
        wind_gusts: gust,
        provider: 'windy',
    };
};

const fetchFromOpenMeteo = async (lat: number, lon: number): Promise<MarineWeather | null> => {
    try {
        const forecastPromise = axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: lat,
                longitude: lon,
                current: ['wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m'],
                timezone: 'auto',
            },
        });

        const marinePromise = axios.get('https://marine-api.open-meteo.com/v1/marine', {
            params: {
                latitude: lat,
                longitude: lon,
                current: ['wave_height', 'swell_wave_height'],
                timezone: 'auto',
            },
        });

        const [forecastResponse, marineResponse] = await Promise.all([forecastPromise, marinePromise]);
        const forecastCurrent = forecastResponse.data?.current ?? {};
        const marineCurrent = marineResponse.data?.current ?? {};

        return {
            time: new Date().toISOString(),
            wind_speed: forecastCurrent?.wind_speed_10m ?? 0,
            wind_direction: forecastCurrent?.wind_direction_10m ?? 0,
            wind_gusts: forecastCurrent?.wind_gusts_10m ?? 0,
            wave_height: marineCurrent?.wave_height ?? 0,
            swell_wave_height: marineCurrent?.swell_wave_height ?? 0,
            provider: 'open-meteo',
        };
    } catch (error) {
        console.error('Open-Meteo fallback failed:', error);
        return null;
    }
};

const fetchFromWindy = async (lat: number, lon: number): Promise<MarineWeather | null> => {
    const data = await fetchWindyPointForecast(lat, lon);
    if (!data) {
        return null;
    }
    return mapWindyToMarineWeather(data);
};

export const fetchMarineWeather = async (lat: number, lon: number): Promise<MarineWeather | null> => {
    const key = cacheKeyFor(lat, lon);
    const cached = weatherCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
    }

    const windyResult = await fetchFromWindy(lat, lon);
    const result = windyResult ?? (await fetchFromOpenMeteo(lat, lon));

    weatherCache.set(key, {
        data: result,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return result;
};

export const __resetWeatherCache = (): void => {
    weatherCache.clear();
};
