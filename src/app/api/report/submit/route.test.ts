import { describe, expect, it, beforeEach, vi } from 'vitest';
import { POST } from './route';
import type { ReportRequest } from '@/types/api';

const mockGetUser = vi.fn();
const mockRpc = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createRouteHandlerSupabaseClient: () => ({
    auth: { getUser: mockGetUser },
    rpc: mockRpc
  })
}));

const validPayload: ReportRequest = {
  location: {
    name: '부산 해운대',
    coordinates: { latitude: 35.1631, longitude: 129.1635 }
  },
  activity: {
    type: '카약',
    startTime: '2025-11-20T01:00:00.000Z',
    endTime: '2025-11-20T03:00:00.000Z',
    participants: 4
  },
  contact: {
    name: '홍길동',
    phone: '010-1234-5678',
    emergencyContact: '010-9999-0000'
  },
  notes: '테스트'
};

function buildRequest(body: BodyInit) {
  return new Request('http://localhost/api/report/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });
}

beforeEach(() => {
  mockGetUser.mockReset();
  mockRpc.mockReset();
});

describe('POST /api/report/submit', () => {
  it('rejects unauthenticated requests', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    const response = await POST(buildRequest(JSON.stringify(validPayload)));
    expect(response.status).toBe(401);
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('handles malformed JSON bodies', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    const response = await POST(buildRequest('{'));
    expect(response.status).toBe(400);
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('validates payload via Zod', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    const invalidPayload = { ...validPayload, contact: { ...validPayload.contact, phone: '0101234' } };
    const response = await POST(buildRequest(JSON.stringify(invalidPayload)));
    expect(response.status).toBe(400);
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('bubbles up RPC errors', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockRpc.mockResolvedValue({ data: null, error: { message: 'db error' } });
    const response = await POST(buildRequest(JSON.stringify(validPayload)));
    const payload = (await response.json()) as { details: string };
    expect(response.status).toBe(500);
    expect(payload.details).toBe('db error');
  });

  it('returns RPC payload on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    const rpcPayload = { id: 'uuid', reportId: 'RPT-20251120-000042' };
    mockRpc.mockResolvedValue({ data: rpcPayload, error: null });
    const response = await POST(buildRequest(JSON.stringify(validPayload)));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(rpcPayload);
    expect(mockRpc).toHaveBeenCalledWith('submit_report', expect.objectContaining({
      location_name: validPayload.location.name,
      participants: validPayload.activity.participants
    }));
  });
});
