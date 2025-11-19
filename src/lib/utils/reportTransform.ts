import type { Database } from '@/types/database.types';
import type { ReportRequest, ReportResponse, ReportStatus } from '@/types/api';
import { reportSchema } from '@/lib/utils/validators';

const REPORT_ID_PREFIX = 'RPT';
const REPORT_ID_PADDING = 6;

export function buildReportIdentifier(createdAt: string, reportNo: number): string {
  const datePart = new Date(createdAt).toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(reportNo).padStart(REPORT_ID_PADDING, '0');
  return `${REPORT_ID_PREFIX}-${datePart}-${seq}`;
}

function normalizeStoredPayload(payload: unknown): ReportRequest {
  const raw = typeof payload === 'object' && payload !== null ? payload : {};
  const normalized = {
    ...(raw as Record<string, unknown>),
    notes: (raw as Record<string, unknown>).notes ?? undefined
  };
  return reportSchema.parse(normalized);
}

export function mapReportRowToResponse(
  row: Database['public']['Tables']['reports']['Row']
): ReportResponse {
  const payload = normalizeStoredPayload(row.location_data);
  const safetyScore = row.safety_score ?? 0;

  return {
    id: row.id,
    reportId: buildReportIdentifier(row.created_at, row.report_no),
    userId: row.user_id,
    status: row.status as ReportStatus,
    safetyScore,
    submittedAt: row.created_at,
    location: payload.location,
    activity: payload.activity,
    contact: payload.contact,
    notes: payload.notes
  };
}
