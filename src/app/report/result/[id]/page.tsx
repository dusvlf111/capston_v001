import { createClient } from '@/lib/supabase/server';
import SafetyAnalysis from '@/components/safety/SafetyAnalysis';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Button from '@/components/ui/Button';

import { fetchMarineWeather } from '@/lib/services/weatherService';
import { fetchWeatherWarnings, fetchCoastGuardStations } from '@/lib/services/publicDataService';
import { generateSafetyReport } from '@/lib/services/aiService';
import { analyzeSafety } from '@/lib/services/safetyService';

export default async function ReportResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: reportData } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

    const report = reportData as any;

    if (!report) {
        notFound();
    }

    const payload = report.location_data;
    // Use stored analysis or calculate it on the fly if missing
    const safetyAnalysis = payload.safety_analysis || await analyzeSafety({
        location: payload.location,
        activity: payload.activity,
        contact: payload.contact,
        companions: payload.companions,
        notes: payload.notes
    });
    const location = payload.location;
    const activity = payload.activity;

    // Fetch external data for AI report
    // We fetch stations with coordinates to get distance
    const [weatherData, warnings, stations] = await Promise.all([
        fetchMarineWeather(location.coordinates.latitude, location.coordinates.longitude),
        fetchWeatherWarnings(), // Default to national/Busan for now
        fetchCoastGuardStations(location.coordinates.latitude, location.coordinates.longitude)
    ]);

    // Generate AI Safety Report
    const aiReport = await generateSafetyReport(
        { location, activity, contact: payload.contact, companions: payload.companions } as any,
        weatherData,
        warnings,
        stations
    );

    // Format report number if available, otherwise use ID prefix
    const reportNo = report.report_no ? `RPT-${report.report_no}` : id.slice(0, 8);

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-8 pb-20">
            <div className="text-center space-y-2 pt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">신고 접수 완료</h1>
                <p className="text-gray-600">
                    접수번호: <span className="font-mono font-medium text-gray-900">{reportNo}</span>
                </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">활동 개요</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-gray-500">활동 종류</dt>
                        <dd className="font-medium text-gray-900">{activity.type}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">위치</dt>
                        <dd className="font-medium text-gray-900">{location.name}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">일시</dt>
                        <dd className="font-medium text-gray-900">
                            {new Date(activity.startTime).toLocaleString('ko-KR')}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">인원</dt>
                        <dd className="font-medium text-gray-900">{activity.participants}명</dd>
                    </div>
                </dl>
            </div>

            {safetyAnalysis ? (
                <SafetyAnalysis
                    result={safetyAnalysis}
                    aiReport={aiReport}
                    weatherData={weatherData}
                    warnings={warnings}
                />
            ) : (
                <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500">
                    안전 분석 정보가 없습니다.
                </div>
            )}

            <div className="flex justify-center gap-4 pt-4">
                <Link href="/">
                    <Button variant="secondary">홈으로</Button>
                </Link>
                <Link href="/report">
                    <Button>추가 신고</Button>
                </Link>
            </div>
        </div>
    );
}
