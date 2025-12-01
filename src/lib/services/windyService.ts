import axios from 'axios';

const WINDY_API_KEY = process.env.NEXT_PUBLIC_WINDY_POINT_FORECAST_KEY;

export interface WindyForecastData {
    wind_u: number;
    wind_v: number;
    gust: number;
    waves_height?: number;
    swell_height?: number;
    ts: number; // timestamp
}

export const fetchWindyPointForecast = async (lat: number, lon: number): Promise<WindyForecastData | null> => {
    if (!WINDY_API_KEY) {
        console.error('Windy Point Forecast API Key is missing.');
        return null;
    }

    try {
        const response = await axios.post('https://api.windy.com/api/point-forecast/v2', {
            key: WINDY_API_KEY,
            lat,
            lon,
            model: 'gfs',
            parameters: ['wind', 'gust', 'waves', 'swell'],
            levels: ['surface'],
            ver: '2_0'
        });

        // Windy API returns data in a specific structure. We need to parse the latest/current data.
        // This is a simplified parsing logic assuming we want the data for the current time.
        const data = response.data;
        console.log('Windy API Response:', JSON.stringify(data, null, 2));

        // Find the index closest to current time
        // Note: This is a simplified extraction. In a real app, you'd match timestamps.
        // Windy returns arrays for each parameter.

        // For MVP, let's just return the first valid data point if available
        // Or better, return the raw data structure if complex processing is needed.
        // Let's try to extract the first item for now.

        // Actual Windy response structure needs to be handled carefully.
        // Assuming 'data' contains keys like 'wind_u-surface', 'wind_v-surface', etc.

        // Let's return a simplified object for the AI to consume.
        // We will take the first element of the arrays (current forecast).

        const windU = data['wind_u-surface']?.[0];
        const windV = data['wind_v-surface']?.[0];
        const gust = data['gust-surface']?.[0];
        const waves = data['waves_height-surface']?.[0];
        const swell = data['swell_height-surface']?.[0];
        const ts = data['ts']?.[0];

        if (ts === undefined) return null;

        return {
            wind_u: windU,
            wind_v: windV,
            gust: gust,
            waves_height: waves,
            swell_height: swell,
            ts: ts
        };

    } catch (error) {
        console.error('Failed to fetch Windy Point Forecast:', error);
        return null;
    }
};
