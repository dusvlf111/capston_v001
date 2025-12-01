'use server';

import axios from 'axios';
import { externalApiConfig } from '@/lib/config/externalApis';

export type WindyPointForecastResponse = Record<string, unknown> & {
    ts?: number[];
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

    try {
        const response = await axios.post(externalApiConfig.windy.pointForecastUrl, {
            key: apiKey,
            lat,
            lon,
            model: externalApiConfig.windy.defaultModel,
            parameters: ['wind', 'gust', 'waves', 'swell'],
            levels: ['surface'],
            units: 'metric',
        });

        return response.data as WindyPointForecastResponse;
    } catch (error) {
        console.error('Failed to fetch Windy Point Forecast:', error);
        return null;
    }
};
