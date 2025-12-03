import { ReportRequest, SafetyAnalysisResult, SafetyRiskFactor } from '@/types/api';
import type { MarineWeather } from '@/lib/services/weatherService';
import type { CoastGuardStation, WeatherWarning } from '@/lib/services/publicDataService';

export interface SafetyAnalysisContext {
    weather?: MarineWeather | null;
    warnings?: WeatherWarning[];
    stations?: CoastGuardStation[];
}

export const SAFETY_ANALYSIS_VERSION = '2025.12';

type DeductionBuckets = {
    weather: number;
    sea: number;
    activity: number;
    response: number;
};

const clampScore = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

const addRisk = (
    bucket: SafetyRiskFactor[],
    entry: SafetyRiskFactor
): void => {
    bucket.push(entry);
};

const applyDeduction = (
    amount: number,
    category: keyof DeductionBuckets,
    accumulator: DeductionBuckets,
    scoreRef: { value: number }
): void => {
    if (amount <= 0) return;
    scoreRef.value -= amount;
    accumulator[category] += amount;
};

export async function analyzeSafety(
    data: ReportRequest,
    context: SafetyAnalysisContext = {}
): Promise<SafetyAnalysisResult> {
    const scoreRef = { value: 100 };
    const risk_factors: SafetyRiskFactor[] = [];
    const recommendations: string[] = [];
    const deductions: DeductionBuckets = {
        weather: 0,
        sea: 0,
        activity: 0,
        response: 0,
    };

    const weather = context.weather;
    if (weather) {
        const maxWind = Math.max(weather.wind_speed ?? 0, weather.wind_gusts ?? 0);
        if (maxWind >= 28) {
            applyDeduction(40, 'weather', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'HIGH',
                message: `돌풍 ${maxWind.toFixed(1)}m/s로 즉시 활동 중지 권고`,
            });
            recommendations.push('기상 악화 시 해역에서 즉시 철수하고 대피하세요.');
        } else if (maxWind >= 20) {
            applyDeduction(25, 'weather', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'HIGH',
                message: `강풍 구간 (${maxWind.toFixed(1)}m/s)으로 활동 위험`,
            });
            recommendations.push('풍속이 안정될 때까지 활동을 연기하세요.');
        } else if (maxWind >= 15) {
            applyDeduction(15, 'weather', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'MEDIUM',
                message: `바람 ${maxWind.toFixed(1)}m/s, 숙련자만 제한적으로 허용`,
            });
            recommendations.push('체중 분산과 구명조끼 등 안전장비를 재점검하세요.');
        } else if (maxWind >= 10) {
            applyDeduction(5, 'weather', deductions, scoreRef);
        }

        const waveHeight = weather.wave_height ?? 0;
        if (waveHeight >= 3) {
            applyDeduction(25, 'sea', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'HIGH',
                message: `파고 ${waveHeight.toFixed(1)}m 이상, 전복 위험`,
            });
            recommendations.push('안벽 계류 및 장비 고정 상태를 다시 확인하세요.');
        } else if (waveHeight >= 2) {
            applyDeduction(15, 'sea', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'MEDIUM',
                message: `높은 파고 (${waveHeight.toFixed(1)}m)로 주의 필요`,
            });
        } else if (waveHeight >= 1) {
            applyDeduction(5, 'sea', deductions, scoreRef);
        }

        const swell = weather.swell_wave_height ?? 0;
        if (swell >= 1.5) {
            applyDeduction(10, 'sea', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'MEDIUM',
                message: `너울 ${swell.toFixed(1)}m로 불규칙 파동 가능성`,
            });
        } else if (swell >= 0.7) {
            applyDeduction(4, 'sea', deductions, scoreRef);
        }
    } else {
        recommendations.push('실시간 풍속·파고 데이터를 확보하면 더 정확한 판단이 가능합니다.');
    }

    const warnings = context.warnings ?? [];
    if (warnings.length > 0) {
        applyDeduction(15, 'weather', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'WEATHER',
            severity: 'HIGH',
            message: `${warnings[0].title} 특보 발효 중`,
        });
        recommendations.push('행정 특보 지침을 준수하고 상황 변화를 수시로 확인하세요.');
    }

    const stations = context.stations ?? [];
    const sortedDistances = stations
        .map((station) => station.distance)
        .filter((distance): distance is number => typeof distance === 'number' && Number.isFinite(distance))
        .sort((a, b) => a - b);
    const nearestDistance = sortedDistances.length > 0 ? sortedDistances[0] : undefined;

    if (nearestDistance === undefined) {
        applyDeduction(5, 'response', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'LOW',
            message: '인근 해경 파출소 거리를 확인할 수 없습니다.',
        });
        recommendations.push('가장 가까운 해경 연락처를 수동으로 확보하세요.');
    } else if (nearestDistance > 30) {
        applyDeduction(15, 'response', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'HIGH',
            message: `해경 대응까지 ${nearestDistance.toFixed(1)}km 이상 소요`,
        });
        recommendations.push('비상 시 자체 구조 계획을 가동할 담당자를 지정하세요.');
    } else if (nearestDistance > 15) {
        applyDeduction(10, 'response', deductions, scoreRef);
        recommendations.push('무전/위치 공유 장비로 신고 지연을 최소화하세요.');
    } else if (nearestDistance > 5) {
        applyDeduction(5, 'response', deductions, scoreRef);
    }

    const startTime = new Date(data.activity.startTime);
    const hour = startTime.getHours();
    if (hour < 6 || hour >= 18) {
        applyDeduction(20, 'activity', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'HIGH',
            message: '야간 활동은 시야 확보가 어려워 위험할 수 있습니다.',
        });
        recommendations.push('일몰 전 활동을 종료하고 조명 장비를 지참하세요.');
    }

    if (data.activity.participants === 1) {
        applyDeduction(10, 'activity', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'LOW',
            message: '단독 활동 시 응급 상황 대처가 어려울 수 있습니다.',
        });
        recommendations.push('가능하면 동반자와 함께 활동하거나, 비상 연락망을 상시 유지하세요.');
    }

    if (data.activity.type === '스쿠버다이빙' && data.activity.participants < 2) {
        applyDeduction(20, 'activity', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'HIGH',
            message: '스쿠버다이빙은 버디 시스템 준수가 필수입니다.',
        });
        recommendations.push('반드시 버디와 함께 다이빙하세요.');
    }

    const score = clampScore(scoreRef.value);
    let level: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
    if (score < 50) level = 'RED';
    else if (score < 80) level = 'YELLOW';

    return {
        score,
        level,
        risk_factors,
        recommendations,
        breakdown: deductions,
        version: SAFETY_ANALYSIS_VERSION,
    };
}
