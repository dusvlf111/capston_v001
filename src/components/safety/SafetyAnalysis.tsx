import React from 'react';
import { SafetyAnalysisResult, SafetyRiskFactor } from '@/types/api';
import { MarineWeather } from '@/lib/services/weatherService';
import { WeatherWarning, CoastGuardStation } from '@/lib/services/publicDataService';

interface SafetyAnalysisProps {
    result: SafetyAnalysisResult;
    aiReport?: {
        summary: string;
        riskLevel: string;
        riskFactors: string[];
        recommendations: string[];
        weatherAnalysis: string;
    } | null;
    weatherData?: MarineWeather | null;
    warnings?: WeatherWarning[];
    stations?: CoastGuardStation[];
}

export default function SafetyAnalysis({ result, aiReport, weatherData, warnings, stations }: SafetyAnalysisProps) {
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

            {/* Marine Conditions (Real-time) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-blue-50">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                        <span>🌊</span> 실시간 해양 기상 정보
                    </h3>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">바람 (Wind)</div>
                        <div className="font-semibold text-gray-900">
                            {weatherData ? weatherData.wind_speed.toFixed(1) : '-'}
                            <span className="text-xs font-normal text-gray-500 ml-1">m/s</span>
                        </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">돌풍 (Gust)</div>
                        <div className="font-semibold text-gray-900">
                            {weatherData ? weatherData.wind_gusts.toFixed(1) : '-'}
                            <span className="text-xs font-normal text-gray-500 ml-1">m/s</span>
                        </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">파고 (Waves)</div>
                        <div className="font-semibold text-gray-900">
                            {weatherData ? weatherData.wave_height.toFixed(1) : '-'}
                            <span className="text-xs font-normal text-gray-500 ml-1">m</span>
                        </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">너울 (Swell)</div>
                        <div className="font-semibold text-gray-900">
                            {weatherData ? weatherData.swell_wave_height.toFixed(1) : '-'}
                            <span className="text-xs font-normal text-gray-500 ml-1">m</span>
                        </div>
                    </div>
                </div>
                {warnings && warnings.length > 0 && (
                    <div className="px-4 pb-4">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                            <div className="text-xs font-bold text-red-700 mb-1">⚠️ 기상 특보</div>
                            <ul className="text-sm text-red-600 space-y-1">
                                {warnings.map((w, i) => (
                                    <li key={i}>
                                        {w.content ? (
                                            <>
                                                <span className="font-medium">{w.title}</span>: {w.content}
                                            </>
                                        ) : (
                                            <span>{w.title}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {stations && stations.length > 0 && (
                    <div className="px-4 pb-4">
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                            <div className="text-xs font-bold text-emerald-700 mb-1">🚨 인근 해양경찰 연락처</div>
                            <ul className="text-sm text-emerald-700 divide-y divide-emerald-100">
                                {stations.slice(0, 3).map((station, index) => (
                                    <li key={`${station.name}-${index}`} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                        <div>
                                            <p className="font-semibold">{station.name}</p>
                                            {station.distance !== undefined && (
                                                <p className="text-xs text-emerald-600">약 {station.distance.toFixed(1)} km</p>
                                            )}
                                        </div>
                                        {station.tel && (
                                            <a href={`tel:${station.tel.replace(/[^0-9]/g, '')}`} className="text-sm font-medium text-emerald-800 underline">
                                                {station.tel}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
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
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${factor.severity === 'HIGH' ? 'bg-red-500' :
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

            {/* AI Safety Report */}
            {aiReport && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🤖</span>
                        <h3 className="text-base font-bold text-slate-800">AI 안전 분석</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-slate-100">
                            <h4 className="text-sm font-semibold text-slate-700 mb-1">종합 요약</h4>
                            <p className="text-slate-600 text-xs leading-relaxed">{aiReport.summary}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-slate-100">
                                <h4 className="text-sm font-semibold text-slate-700 mb-1">기상 분석</h4>
                                <p className="text-slate-600 text-xs">{aiReport.weatherAnalysis}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-100">
                                <h4 className="text-sm font-semibold text-slate-700 mb-1">권장사항</h4>
                                <ul className="text-slate-600 text-xs space-y-1.5">
                                    {aiReport.recommendations.map((rec, idx) => (
                                        <li key={idx} className="leading-relaxed whitespace-pre-wrap break-words flex items-start gap-1.5">
                                            <span className="text-slate-400 mt-0.5">•</span>
                                            <span className="flex-1">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
