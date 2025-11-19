import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server';
import { parseReport } from '@/lib/utils/validators';
import type { ReportRequest } from '@/types/api';

export async function POST(request: Request) {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: '요청 본문을 파싱할 수 없습니다.' }, { status: 400 });
  }

  let payload: ReportRequest;
  try {
    payload = parseReport(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: '입력값 검증에 실패했습니다.', issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: '알 수 없는 오류가 발생했습니다.' }, { status: 400 });
  }

  const { location, activity, contact, notes } = payload;
  const { data, error: rpcError } = await supabase.rpc('submit_report', {
    location_name: location.name,
    location_lat: location.coordinates.latitude,
    location_lng: location.coordinates.longitude,
    activity_type: activity.type,
    start_time: activity.startTime,
    end_time: activity.endTime,
    participants: activity.participants,
    contact_name: contact.name,
    contact_phone: contact.phone,
    emergency_contact: contact.emergencyContact,
    notes: notes ?? null
  });

  if (rpcError) {
    return NextResponse.json(
      { message: '신고 저장에 실패했습니다.', details: rpcError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
