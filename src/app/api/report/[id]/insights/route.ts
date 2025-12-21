import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildReportInsights } from '@/lib/services/reportInsightsService';
import type { Database } from '@/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

type ReportRow = Database['public']['Tables']['reports']['Row'] & {
    location_data: unknown;
};

function formatReportNo(report: ReportRow, fallbackId: string): string {
    if (report.report_no) {
        return `RPT-${report.report_no}`;
    }
    return fallbackId.slice(0, 8);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = (await createClient()) as unknown as SupabaseClient<Database>;
        const { data: report, error } = await supabase
            .from('reports')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !report) {
            return NextResponse.json({ message: 'Report not found' }, { status: 404 });
        }

        const reportRow = report as ReportRow;
        const { insights, updatedPayload, changed } = await buildReportInsights(reportRow);

        if (changed) {
            const persisted = JSON.parse(JSON.stringify(updatedPayload));
            await supabase
                .from('reports')
                .update({ location_data: persisted })
                .eq('id', id);
        }

        return NextResponse.json({
            id: reportRow.id,
            reportNo: formatReportNo(reportRow, id),
            location: updatedPayload.location,
            activity: updatedPayload.activity,
            contact: updatedPayload.contact,
            notes: updatedPayload.notes,
            companions: updatedPayload.companions,
            insights,
        });
    } catch (error) {
        console.error('Failed to fetch report insights:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
