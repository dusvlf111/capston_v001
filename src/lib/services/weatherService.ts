import axios from 'axios';

export interface MarineWeather {
    time: string;
    wave_height: number;
    swell_wave_height: number;
    wind_speed: number;
    wind_direction: number;
    wind_gusts: number;
}

export const fetchMarineWeather = async (lat: number, lon: number): Promise<MarineWeather | null> => {
    try {
        // Fetch Wind/Gusts from General Forecast API (Works on land/coast)
        const forecastPromise = axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: lat,
                longitude: lon,
                current: ['wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m'],
                timezone: 'auto'
            }
        });

        // Fetch Waves from Marine API (Works on water, might be 0 on land)
        const marinePromise = axios.get('https://marine-api.open-meteo.com/v1/marine', {
            params: {
                latitude: lat,
                longitude: lon,
                current: ['wave_height', 'swell_wave_height'],
                timezone: 'auto'
            }
        });

        const [forecastResponse, marineResponse] = await Promise.all([forecastPromise, marinePromise]);

        const forecastCurrent = forecastResponse.data.current;
        const marineCurrent = marineResponse.data.current;

        return {
            time: new Date().toISOString(),
            // Wind from General Forecast
            wind_speed: forecastCurrent?.wind_speed_10m ?? 0,
            wind_direction: forecastCurrent?.wind_direction_10m ?? 0,
            wind_gusts: forecastCurrent?.wind_gusts_10m ?? 0,
            // Waves from Marine Forecast
            wave_height: marineCurrent?.wave_height ?? 0,
            swell_wave_height: marineCurrent?.swell_wave_height ?? 0,
        };

    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return null;
    }
};
