import { ReportRequest, SafetyAnalysisResult, SafetyRiskFactor } from '@/types/api';

export async function analyzeSafety(data: ReportRequest): Promise<SafetyAnalysisResult> {
    let score = 100;
    const risk_factors: SafetyRiskFactor[] = [];
    const recommendations: string[] = [];

    // 1. Time Check (Night time activity)
    const startTime = new Date(data.activity.startTime);
    const hour = startTime.getHours();

    if (hour < 6 || hour >= 18) {
        score -= 30;
        risk_factors.push({
            type: 'OTHER',
            severity: 'HIGH',
            message: '야간 활동은 시야 확보가 어려워 위험할 수 있습니다.'
        });
        recommendations.push('일몰 전 활동을 종료하고 조명 장비를 지참하세요.');
    }

    // 2. Participant Check (Solo activity)
    if (data.activity.participants === 1) {
        score -= 10;
        risk_factors.push({
            type: 'OTHER',
            severity: 'LOW',
            message: '단독 활동 시 응급 상황 대처가 어려울 수 있습니다.'
        });
        recommendations.push('가능하면 동반자와 함께 활동하거나, 비상 연락망을 상시 유지하세요.');
    }

    // 3. Activity Type Specific Checks (Mock)
    if (data.activity.type === '스쿠버다이빙' && data.activity.participants < 2) {
        score -= 20;
        risk_factors.push({
            type: 'OTHER',
            severity: 'HIGH',
            message: '스쿠버다이빙은 버디 시스템 준수가 필수입니다.'
        });
        recommendations.push('반드시 버디와 함께 다이빙하세요.');
    }

    // 4. Weather Mock (Randomized for demo if no API)
    // In a real app, we would fetch weather data here.
    // For MVP, let's assume good weather unless it's a specific "bad weather" demo location or time.

    // Determine Level
    let level: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
    if (score < 50) level = 'RED';
    else if (score < 80) level = 'YELLOW';

    return {
        score: Math.max(0, score),
        level,
        risk_factors,
        recommendations
    };
}
