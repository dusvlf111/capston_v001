import { describe, expect, it } from 'vitest';
import { buildReportIdentifier, mapReportRowToResponse } from '@/lib/utils/reportTransform';
import type { Database } from '@/types/database.types';

const baseRow: Database['public']['Tables']['reports']['Row'] = {
  id: 'uuid-1234',
  user_id: 'user-1',
  report_no: 42,
  location_data: {
    location: {
      name: '부산 해운대',
      coordinates: { latitude: 35.1631, longitude: 129.1635 }
    },
    activity: {
      type: '카약',
      startTime: '2025-11-20T01:00:00.000Z',
      endTime: '2025-11-20T03:30:00.000Z',
      participants: 4
    },
    contact: {
      name: '홍길동',
      phone: '010-1234-5678',
      emergencyContact: '010-9999-0000'
    },
    notes: '테스트'
  },
  status: 'CAUTION',
  safety_score: 68,
  created_at: '2025-11-20T04:00:00.000Z',
  updated_at: '2025-11-20T04:00:00.000Z'
};

describe('reportTransform utilities', () => {
  it('creates readable report identifiers', () => {
    const identifier = buildReportIdentifier('2025-01-05T12:00:00.000Z', 15);
    expect(identifier).toBe('RPT-20250105-000015');
  });

  it('maps database rows to ReportResponse payloads', () => {
    const storedPayload = baseRow.location_data as {
      location: Record<string, unknown>;
      activity: Record<string, unknown>;
      contact: Record<string, unknown>;
      notes: string;
    };
    const response = mapReportRowToResponse(baseRow);
    expect(response).toMatchObject({
      id: 'uuid-1234',
      reportId: 'RPT-20251120-000042',
      status: 'CAUTION',
      safetyScore: 68,
      location: storedPayload.location,
      activity: storedPayload.activity,
      contact: storedPayload.contact,
      notes: '테스트'
    });
  });
});
