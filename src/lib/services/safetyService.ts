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

    // 날씨 데이터 분석
    const weather = context.weather;
    if (weather) {
        // 풍속 분석 (0-30점 감점)
        const maxWind = Math.max(weather.wind_speed ?? 0, weather.wind_gusts ?? 0);
        if (maxWind >= 25) {
            applyDeduction(30, 'weather', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'HIGH',
                message: `매우 강한 바람 ${maxWind.toFixed(1)}m/s - 활동 중지 권고`,
            });
            recommendations.push('기상 악화로 활동을 즉시 중단하고 대피하세요.');
        } else if (maxWind >= 18) {
            applyDeduction(20, 'weather', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'HIGH',
                message: `강풍 ${maxWind.toFixed(1)}m/s - 숙련자 외 활동 자제`,
            });
            recommendations.push('풍속이 안정될 때까지 활동을 연기하세요.');
        } else if (maxWind >= 12) {
            applyDeduction(12, 'weather', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'MEDIUM',
                message: `보통 강풍 ${maxWind.toFixed(1)}m/s - 주의 필요`,
            });
            recommendations.push('안전장비를 재점검하고 주의하여 활동하세요.');
        } else if (maxWind >= 8) {
            applyDeduction(5, 'weather', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'LOW',
                message: `약한 바람 ${maxWind.toFixed(1)}m/s`,
            });
        }

        // 파고 분석 (0-25점 감점)
        const waveHeight = weather.wave_height ?? 0;
        if (waveHeight >= 3.0) {
            applyDeduction(25, 'sea', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'HIGH',
                message: `매우 높은 파고 ${waveHeight.toFixed(1)}m - 전복 위험`,
            });
            recommendations.push('높은 파도로 인해 활동을 중단하세요.');
        } else if (waveHeight >= 2.0) {
            applyDeduction(15, 'sea', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'MEDIUM',
                message: `높은 파고 ${waveHeight.toFixed(1)}m - 주의 필요`,
            });
            recommendations.push('파도 상태를 지속적으로 확인하세요.');
        } else if (waveHeight >= 1.0) {
            applyDeduction(7, 'sea', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'LOW',
                message: `보통 파고 ${waveHeight.toFixed(1)}m`,
            });
        }

        // 너울 분석 (0-12점 감점)
        const swell = weather.swell_wave_height ?? 0;
        if (swell >= 1.5) {
            applyDeduction(12, 'sea', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'WEATHER',
                severity: 'MEDIUM',
                message: `큰 너울 ${swell.toFixed(1)}m - 불규칙 파동 가능`,
            });
            recommendations.push('너울로 인한 불규칙한 파도에 주의하세요.');
        } else if (swell >= 0.8) {
            applyDeduction(5, 'sea', deductions, scoreRef);
        }

        // 수온 분석 (0-10점 감점)
        const waterTemp = weather.water_temperature ?? null;
        if (waterTemp !== null) {
            if (waterTemp < 10) {
                applyDeduction(10, 'weather', deductions, scoreRef);
                addRisk(risk_factors, {
                    type: 'WEATHER',
                    severity: 'HIGH',
                    message: `매우 낮은 수온 ${waterTemp.toFixed(1)}°C - 저체온증 위험`,
                });
                recommendations.push('저수온으로 인해 보온복을 착용하고 활동 시간을 단축하세요.');
            } else if (waterTemp < 15) {
                applyDeduction(5, 'weather', deductions, scoreRef);
                addRisk(risk_factors, {
                    type: 'WEATHER',
                    severity: 'MEDIUM',
                    message: `낮은 수온 ${waterTemp.toFixed(1)}°C - 보온 필요`,
                });
                recommendations.push('적절한 보온 장비를 착용하세요.');
            }
        }

        // 기온 분석 (0-8점 감점)
        const airTemp = weather.air_temperature ?? null;
        if (airTemp !== null) {
            if (airTemp < 5) {
                applyDeduction(8, 'weather', deductions, scoreRef);
                addRisk(risk_factors, {
                    type: 'WEATHER',
                    severity: 'MEDIUM',
                    message: `저온 ${airTemp.toFixed(1)}°C - 방한 장비 필수`,
                });
                recommendations.push('추운 날씨로 인해 충분한 방한 장비를 준비하세요.');
            } else if (airTemp > 35) {
                applyDeduction(5, 'weather', deductions, scoreRef);
                addRisk(risk_factors, {
                    type: 'WEATHER',
                    severity: 'MEDIUM',
                    message: `고온 ${airTemp.toFixed(1)}°C - 열사병 주의`,
                });
                recommendations.push('무더운 날씨로 인해 충분한 수분을 섭취하세요.');
            }
        }
    } else {
        // 날씨 정보 없음 (5점 감점)
        applyDeduction(5, 'weather', deductions, scoreRef);
        recommendations.push('실시간 기상 데이터를 확인하여 더 안전한 활동을 하세요.');
    }

    // 기상 특보 분석 (0-20점 감점)
    const warnings = context.warnings ?? [];
    if (warnings.length > 0) {
        applyDeduction(20, 'weather', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'WEATHER',
            severity: 'HIGH',
            message: `${warnings[0].title} 특보 발효 중`,
        });
        recommendations.push('기상 특보 발효 중이므로 활동을 자제하고 상황을 지속적으로 확인하세요.');
    }

    // 해양경찰 거리 분석 (0-15점 감점)
    const stations = context.stations ?? [];
    const sortedDistances = stations
        .map((station) => station.distance)
        .filter((distance): distance is number => typeof distance === 'number' && Number.isFinite(distance))
        .sort((a, b) => a - b);
    const nearestDistance = sortedDistances.length > 0 ? sortedDistances[0] : undefined;

    if (nearestDistance === undefined) {
        applyDeduction(8, 'response', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'LOW',
            message: '인근 해경 파출소 정보를 확인할 수 없습니다.',
        });
        recommendations.push('가장 가까운 해경 연락처(122)를 저장하세요.');
    } else if (nearestDistance > 50) {
        applyDeduction(15, 'response', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'HIGH',
            message: `해경까지 ${nearestDistance.toFixed(1)}km로 매우 먼 거리`,
        });
        recommendations.push('원거리 활동 시 위성 통신 장비를 준비하세요.');
    } else if (nearestDistance > 30) {
        applyDeduction(10, 'response', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'MEDIUM',
            message: `해경까지 ${nearestDistance.toFixed(1)}km로 먼 거리`,
        });
        recommendations.push('비상 연락 수단을 확보하세요.');
    } else if (nearestDistance > 10) {
        applyDeduction(5, 'response', deductions, scoreRef);
    }

    // 활동 시간 분석 (0-15점 감점)
    const startTime = new Date(data.activity.startTime);
    const hour = startTime.getHours();
    if (hour < 5 || hour >= 20) {
        applyDeduction(15, 'activity', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'HIGH',
            message: '심야 시간대 활동으로 시야 확보가 매우 어렵습니다.',
        });
        recommendations.push('어두운 시간대 활동 시 조명 장비를 필수로 준비하세요.');
    } else if (hour < 6 || hour >= 18) {
        applyDeduction(10, 'activity', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'MEDIUM',
            message: '일출/일몰 시간대로 시야 확보에 주의가 필요합니다.',
        });
        recommendations.push('일몰 전 활동을 종료하고 조명 장비를 지참하세요.');
    }

    // 참가자 수 분석 (0-12점 감점)
    if (data.activity.participants === 1) {
        applyDeduction(12, 'activity', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'MEDIUM',
            message: '단독 활동으로 응급 상황 대처가 어려울 수 있습니다.',
        });
        recommendations.push('가능하면 동반자와 함께 활동하고, 비상 연락망을 확보하세요.');
    } else if (data.activity.participants >= 10) {
        applyDeduction(5, 'activity', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'LOW',
            message: '많은 인원으로 인한 관리 어려움이 있을 수 있습니다.',
        });
        recommendations.push('안전 책임자를 지정하고 비상 계획을 수립하세요.');
    }

    // 활동 유형별 추가 위험 (0-10점 감점)
    if (data.activity.type === '스쿠버다이빙') {
        if (data.activity.participants < 2) {
            applyDeduction(10, 'activity', deductions, scoreRef);
            addRisk(risk_factors, {
                type: 'OTHER',
                severity: 'HIGH',
                message: '스쿠버다이빙은 버디 시스템 준수가 필수입니다.',
            });
            recommendations.push('반드시 2인 이상 버디와 함께 다이빙하세요.');
        }
    } else if (data.activity.type === '수상오토바이') {
        applyDeduction(5, 'activity', deductions, scoreRef);
        addRisk(risk_factors, {
            type: 'OTHER',
            severity: 'MEDIUM',
            message: '고속 수상 레저 활동으로 충돌 위험이 있습니다.',
        });
        recommendations.push('안전 거리를 유지하고 구명조끼를 착용하세요.');
    }

    const score = clampScore(scoreRef.value);
    let level: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
    if (score < 60) level = 'RED';
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
