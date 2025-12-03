'use server';

import axios, { isAxiosError } from 'axios';
import { externalApiConfig } from '@/lib/config/externalApis';

export type WindyPointForecastResponse = Record<string, unknown> & {
    ts?: number[];
};

type WindyParameter = 'wind' | 'windGust';
type WindyLevel = 'surface';

interface WindyPointForecastPayload {
    key: string;
    lat: number;
    lon: number;
    model: string;
    parameters: WindyParameter[];
    levels: WindyLevel[];
    units: 'metric';
}

const WINDY_PARAMETERS: WindyParameter[] = ['wind', 'windGust'];
const WINDY_LEVELS: WindyLevel[] = ['surface'];
const COORDINATE_PRECISION = 3;

const normalizeCoordinate = (value: number): number | null => {
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
        return null;
    }
    return Number(value.toFixed(COORDINATE_PRECISION));
};

const buildPayload = (lat: number, lon: number, key: string): WindyPointForecastPayload | null => {
    const normalizedLat = normalizeCoordinate(lat);
    const normalizedLon = normalizeCoordinate(lon);

    if (normalizedLat === null || normalizedLon === null) {
        console.error('Invalid coordinates when building Windy payload', { lat, lon });
        return null;
    }

    const model = externalApiConfig.windy.defaultModel || 'gfs';

    return {
        key,
        lat: normalizedLat,
        lon: normalizedLon,
        model,
        parameters: WINDY_PARAMETERS,
        levels: WINDY_LEVELS,
        units: 'metric',
    };
};

export const fetchWindyPointForecast = async (
    lat: number,
    lon: number
): Promise<WindyPointForecastResponse | null> => {
    const apiKey = externalApiConfig.windy.pointForecastKey;
    if (!apiKey) {
        console.error('WINDY_POINT_API_KEY is missing. Unable to call Windy Point Forecast API.');
        return null;
    }

    const payload = buildPayload(lat, lon, apiKey);
    if (!payload) {
        return null;
    }

    try {
        const response = await axios.post(externalApiConfig.windy.pointForecastUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10_000,
        });

        return response.data as WindyPointForecastResponse;
    } catch (error) {
        if (isAxiosError(error)) {
            console.error('Failed to fetch Windy Point Forecast:', {
                status: error.response?.status,
                data: error.response?.data,
            });
        } else {
            console.error('Failed to fetch Windy Point Forecast:', error);
        }
        return null;
    }
};
