import { render, screen } from '@testing-library/react';
import SafetyAnalysis from './SafetyAnalysis';
import type { SafetyAnalysisResult } from '@/types/api';
import type { MarineWeather } from '@/lib/services/weatherService';
import type { WeatherWarning, CoastGuardStation } from '@/lib/services/publicDataService';

describe('SafetyAnalysis', () => {
    const baseResult: SafetyAnalysisResult = {
        score: 82,
        level: 'GREEN',
        risk_factors: [
            {
                type: 'WEATHER',
                severity: 'LOW',
                message: '파도 상태 양호'
            }
        ],
        recommendations: ['구명조끼 착용 유지', '30분 간격 체크인']
    };

    const weatherData: MarineWeather = {
        time: new Date().toISOString(),
        wind_speed: 5,
        wind_direction: 180,
        wind_gusts: 8,
        wave_height: 1.2,
        swell_wave_height: 0.5,
        provider: 'windy'
    };

    const warnings: WeatherWarning[] = [
        { title: '강풍주의보', content: '남해 전역 강풍', tmFc: new Date().toISOString() }
    ];

    const stations: CoastGuardStation[] = [
        { name: '부산해양경찰서', tel: '051-664-2000', lat: 35.097, lon: 129.037, distance: 3.2 },
        { name: '울산해양경찰서', tel: '052-230-2000', lat: 35.519, lon: 129.376, distance: 55.1 }
    ];

    it('renders weather cards, warnings, and AI info', () => {
        render(
            <SafetyAnalysis
                result={baseResult}
                weatherData={weatherData}
                warnings={warnings}
                aiReport={{
                    summary: '안전 수준 양호',
                    riskLevel: 'LOW',
                    riskFactors: ['약한 돌풍 가능성'],
                    recommendations: ['출항 전 장비 재확인'],
                    weatherAnalysis: '남서풍 5m/s, 파고 안정적'
                }}
            />
        );

        expect(screen.getByText('82')).toBeInTheDocument();
        expect(screen.getByText('바람 (Wind)')).toBeInTheDocument();
        expect(screen.getByText('강풍주의보')).toBeInTheDocument();
        expect(screen.getByText('안전 수준 양호')).toBeInTheDocument();
        expect(screen.getByText('남서풍 5m/s, 파고 안정적')).toBeInTheDocument();
    });

    it('lists nearest coast guard stations with tel links', () => {
        render(
            <SafetyAnalysis
                result={baseResult}
                weatherData={weatherData}
                stations={stations}
            />
        );

        expect(screen.getByText('부산해양경찰서')).toBeInTheDocument();
        const telLink = screen.getByRole('link', { name: /051-664-2000/ });
        expect(telLink).toHaveAttribute('href', 'tel:0516642000');
        expect(screen.getByText(/약 3\.2 km/)).toBeInTheDocument();
    });
});
