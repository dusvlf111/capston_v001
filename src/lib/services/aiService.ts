import type { ReportRequest } from '@/types/api';
import type { MarineWeather } from './weatherService';
import type { WeatherWarning, CoastGuardStation } from './publicDataService';

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const PRIMARY_MODEL = 'gpt-5-mini-2025-08-07';
const FALLBACK_MODEL = 'gpt-4o-mini';

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
    You are a marine safety expert AI. Analyze the following maritime activity plan and environmental data to provide a **concise** safety report. 한국어로 작성하세요.

    **Activity Details:**
    - Type: ${report.activity.type}
    - Location: ${report.location.name} (${report.location.coordinates.latitude}, ${report.location.coordinates.longitude})
    - Time: ${report.activity.startTime}${report.activity.endTime ? ` ~ ${report.activity.endTime}` : ' (종료 시간 미정)'}
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

        const content = await requestCompletion(prompt);
        if (!content) return null;

        try {
            return JSON.parse(content) as AISafetyReport;
        } catch (error) {
            console.error('Failed to parse AI safety report JSON:', error);
            return null;
        }

    } catch (error) {
        console.error('Failed to generate AI safety report:', error);
        // Fallback or re-throw depending on requirements
        return null;
    }
};

interface ChatCompletionResponse {
    choices: { message: { content: string | null } }[];
}

const callChatCompletion = async (model: string, prompt: string): Promise<string | null> => {
    const response = await fetch(OPENAI_CHAT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: 'You are a helpful marine safety assistant.' },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody?.error?.message || response.statusText;
        throw new Error(`[${response.status}] ${message}`);
    }

    const data = (await response.json()) as ChatCompletionResponse;
    return data.choices?.[0]?.message?.content ?? null;
};

const requestCompletion = async (prompt: string): Promise<string | null> => {
    const models = [PRIMARY_MODEL, FALLBACK_MODEL];
    for (const model of models) {
        try {
            const content = await callChatCompletion(model, prompt);
            if (content) {
                return content;
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (model === PRIMARY_MODEL) {
                console.warn('Primary model failed, attempting fallback:', message);
            } else {
                if (message.includes('429')) {
                    console.warn('OpenAI rate limit reached:', message);
                } else {
                    console.error('Fallback model failed:', message);
                }
            }
        }
    }
    return null;
};
