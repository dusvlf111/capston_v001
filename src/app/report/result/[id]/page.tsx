import { createClient } from '@/lib/supabase/server';
import SafetyAnalysis from '@/components/safety/SafetyAnalysis';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Button from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils/dateFormat';

import { buildReportInsights } from '@/lib/services/reportInsightsService';
import type { Database } from '@/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

type ReportRow = Database['public']['Tables']['reports']['Row'] & {
    location_data: unknown;
};
type ReportsUpdate = Database['public']['Tables']['reports']['Update'];

export default async function ReportResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = (await createClient()) as unknown as SupabaseClient<Database>;
    const { data: reportData } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

    const report = reportData as unknown as ReportRow;

    if (!report) {
        notFound();
    }

    const { insights, updatedPayload, changed } = await buildReportInsights(report);
    if (changed) {
        const persistedPayload = JSON.parse(JSON.stringify(updatedPayload)) as ReportsUpdate['location_data'];
        await supabase
            .from('reports')
            .update({ location_data: persistedPayload })
            .eq('id', id);
    }

    const location = updatedPayload.location;
    const activity = updatedPayload.activity;
    const { safetyAnalysis, weather: weatherData, warnings, stations, aiReport } = insights;

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
                <h1 className="text-2xl font-bold text-white-900">신고 접수 완료</h1>
                <p className="text-white-600">
                    접수번호: <span className="font-mono font-medium text-white-900">{reportNo}</span>
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
                            {formatDateTime(activity.startTime)}
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
                    stations={stations}
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
