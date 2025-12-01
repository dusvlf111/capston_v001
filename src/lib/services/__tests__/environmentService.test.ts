import { describe, it, expect, vi } from 'vitest';
import { fetchEnvironmentalInsights } from '../environmentService';
import { fetchMarineWeather } from '../weatherService';
import { fetchWeatherWarnings, fetchCoastGuardStations } from '../publicDataService';

vi.mock('../weatherService', () => ({
    fetchMarineWeather: vi.fn(),
}));

vi.mock('../publicDataService', () => ({
    fetchWeatherWarnings: vi.fn(),
    fetchCoastGuardStations: vi.fn(),
}));

const mockedWeather = fetchMarineWeather as unknown as ReturnType<typeof vi.fn>;
const mockedWarnings = fetchWeatherWarnings as unknown as ReturnType<typeof vi.fn>;
const mockedStations = fetchCoastGuardStations as unknown as ReturnType<typeof vi.fn>;

describe('environmentService.fetchEnvironmentalInsights', () => {
    it('aggregates weather, warnings, and station data', async () => {
        mockedWeather.mockResolvedValue({
            time: new Date().toISOString(),
            wind_speed: 5,
            wind_direction: 120,
            wind_gusts: 8,
            wave_height: 1,
            swell_wave_height: 0.5,
            provider: 'windy',
        });
        mockedWarnings.mockResolvedValue([{ title: '강풍주의보', content: '바람 주의', tmFc: new Date().toISOString() }]);
        mockedStations.mockResolvedValue([{ name: '부산해경', tel: '051-123-4567', lat: 35, lon: 129 }]);

        const insights = await fetchEnvironmentalInsights({ lat: 35.1, lon: 129.1, warningStationId: 159 });

        expect(mockedWeather).toHaveBeenCalledWith(35.1, 129.1);
        expect(mockedWarnings).toHaveBeenCalledWith(159);
        expect(mockedStations).toHaveBeenCalledWith(35.1, 129.1);
        expect(insights.weather?.provider).toBe('windy');
        expect(insights.warnings).toHaveLength(1);
        expect(insights.stations[0].name).toBe('부산해경');
        expect(insights.fetchedAt).toBeTruthy();
    });
});
