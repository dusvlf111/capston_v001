import OpenAI from 'openai';
import type { ReportRequest } from '@/types/api';
import type { MarineWeather } from './weatherService';
import type { WeatherWarning, CoastGuardStation } from './publicDataService';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export interface AISafetyReport {
    summary: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskFactors: string[];
    recommendations: string[];
    weatherAnalysis: string;
}

export const generateSafetyReport = async (
    report: ReportRequest,
    weatherData: MarineWeather | null,
    warnings: WeatherWarning[],
    stations: CoastGuardStation[]
): Promise<AISafetyReport | null> => {
    if (!process.env.OPENAI_API_KEY) {
        console.error('OpenAI API Key is missing.');
        return null;
    }

    try {
        console.log('Generating AI Safety Report with data:', { report, weatherData, warnings, stations });

        const nearestStations = stations.slice(0, 3)
            .map((station, index) => ` ${index + 1}. ${station.name}${station.distance !== undefined ? ` (${station.distance.toFixed(1)} km)` : ''}${station.tel ? ` / ${station.tel}` : ''}`)
            .join('\n') || ' 정보 없음';

        const prompt = `
    You are a marine safety expert AI. Analyze the following maritime activity plan and environmental data to provide a **concise** safety report.

    **Activity Details:**
    - Type: ${report.activity.type}
    - Location: ${report.location.name} (${report.location.coordinates.latitude}, ${report.location.coordinates.longitude})
    - Time: ${report.activity.startTime} ~ ${report.activity.endTime}
    - Participants: ${report.activity.participants}
    - Companions: ${report.companions?.length || 0}

    **Environmental Data (Real-time):**
    - Wind: ${weatherData ? `${weatherData.wind_speed} m/s (Dir: ${weatherData.wind_direction}°)` : 'N/A'}
    - Gust: ${weatherData?.wind_gusts ?? 'N/A'} m/s
    - Waves: ${weatherData?.wave_height ?? 'N/A'} m
    - Swell: ${weatherData?.swell_wave_height ?? 'N/A'} m
    - Weather Warnings: ${warnings.length > 0 ? warnings.map(w => `${w.title} (${w.content || '내용 없음'})`).join('; ') : 'None'}

    **Nearby Resources:**
    ${nearestStations}

    **Instructions:**
    1. **Analyze Safety**: Determine Risk Level (LOW, MEDIUM, HIGH).
    2. **Short Summary**: Write a **very brief** executive summary (max 2 sentences).
    3. **Key Risks**: List up to 3 critical risk factors.
    4. **Recommendations**: List up to 3 key actionable recommendations.
    5. **Weather**: Brief comment on weather conditions (1 sentence).

    **Response Format (JSON only):**
    {
      "summary": "Short summary...",
      "riskLevel": "LOW" | "MEDIUM" | "HIGH",
      "riskFactors": ["Risk 1", "Risk 2"],
      "recommendations": ["Rec 1", "Rec 2"],
      "weatherAnalysis": "Brief weather comment..."
    }
    `;

        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: "gpt-5-mini-2025-08-07",
                messages: [
                    { role: "system", content: "You are a helpful marine safety assistant." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            });
        } catch (error) {
            console.warn('Primary model failed, falling back to gpt-4o-mini:', error);
            completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful marine safety assistant." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            });
        }

        const content = completion.choices[0].message.content;
        if (!content) return null;

        return JSON.parse(content) as AISafetyReport;

    } catch (error) {
        console.error('Failed to generate AI safety report:', error);
        // Fallback or re-throw depending on requirements
        return null;
    }
};
