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

    const [weather, warnings, stations] = await Promise.all([
        fetchMarineWeather(lat, lon),
        fetchWeatherWarnings(warningStationId),
        fetchCoastGuardStations(lat, lon),
    ]);

    return {
        weather,
        warnings,
        stations,
        fetchedAt: new Date().toISOString(),
    };
};
