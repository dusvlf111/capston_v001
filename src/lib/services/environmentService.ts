import { fetchMarineWeather, MarineWeather } from './weatherService';
import { fetchWeatherWarnings, fetchCoastGuardStations, WeatherWarning, CoastGuardStation } from './publicDataService';

export interface EnvironmentalInsightsOptions {
    lat: number;
    lon: number;
    warningStationId?: number;
}

export interface EnvironmentalInsights {
    weather: MarineWeather | null;
    warnings: WeatherWarning[];
    stations: CoastGuardStation[];
    fetchedAt: string;
}

export const fetchEnvironmentalInsights = async (
    options: EnvironmentalInsightsOptions
): Promise<EnvironmentalInsights> => {
    const { lat, lon, warningStationId } = options;

    const weatherPromise = fetchMarineWeather(lat, lon).catch(error => {
        console.error('EnvironmentalInsights: marine weather fetch failed', error);
        return null;
    });

    const warningsPromise = fetchWeatherWarnings(warningStationId).catch(error => {
        console.error('EnvironmentalInsights: weather warnings fetch failed', error);
        return [] as WeatherWarning[];
    });

    const stationsPromise = fetchCoastGuardStations(lat, lon).catch(error => {
        console.error('EnvironmentalInsights: coast guard stations fetch failed', error);
        return [] as CoastGuardStation[];
    });

    const [weather, warnings, stations] = await Promise.all([
        weatherPromise,
        warningsPromise,
        stationsPromise,
    ]);

    return {
        weather,
        warnings,
        stations,
        fetchedAt: new Date().toISOString(),
    };
};
