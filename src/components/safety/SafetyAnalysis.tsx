import React from 'react';
import { SafetyAnalysisResult, SafetyRiskFactor } from '@/types/api';

interface SafetyAnalysisProps {
    result: SafetyAnalysisResult;
}

export default function SafetyAnalysis({ result }: SafetyAnalysisProps) {
    const { score, level, risk_factors, recommendations } = result;

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'GREEN': return 'text-green-600 bg-green-50 border-green-200';
            case 'YELLOW': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'RED': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Score Section */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-600 mb-2">종합 안전 점수</h3>
                <div className={`text-5xl font-bold mb-2 ${getScoreColor(score)}`}>
                    {score}
                    <span className="text-2xl text-gray-400 font-normal">/100</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(level)}`}>
                    {level === 'GREEN' ? '안전' : level === 'YELLOW' ? '주의' : '위험'}
                </span>
            </div>

            {/* Risk Factors */}
            {risk_factors.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-semibold text-gray-800">위험 요소 감지</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {risk_factors.map((factor, index) => (
                            <div key={index} className="p-4 flex items-start gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${factor.severity === 'HIGH' ? 'bg-red-500' :
                                        factor.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`} />
                                <div>
                                    <p className="text-gray-800 font-medium">{factor.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        유형: {factor.type} | 심각도: {factor.severity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        💡 안전 가이드
                    </h3>
                    <ul className="space-y-2">
                        {recommendations.map((rec, index) => (
                            <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                                <span>•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
