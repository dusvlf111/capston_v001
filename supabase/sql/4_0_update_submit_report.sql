-- 4_0_update_submit_report.sql
-- Update submit_report to accept companions and external safety analysis

BEGIN;

CREATE OR REPLACE FUNCTION public.submit_report(
  location_name TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  activity_type TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  participants INTEGER,
  contact_name TEXT,
  contact_phone TEXT,
  emergency_contact TEXT,
  notes TEXT DEFAULT NULL,
  companions JSONB DEFAULT '[]'::jsonb,
  analysis_data JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_safety_score INTEGER;
  v_status TEXT := 'CAUTION';
  v_report RECORD;
  v_payload JSONB;
  v_report_code TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 신고를 제출할 수 있습니다.';
  END IF;

  IF end_time <= start_time THEN
    RAISE EXCEPTION '종료 시간은 시작 시간 이후여야 합니다.';
  END IF;

  IF participants <= 0 THEN
    RAISE EXCEPTION '참가자 수는 1명 이상이어야 합니다.';
  END IF;

  -- Use provided safety score or default to 80
  v_safety_score := COALESCE((analysis_data->>'score')::INTEGER, 80);

  -- Determine status based on score
  IF v_safety_score >= 80 THEN
    v_status := 'APPROVED';
  ELSIF v_safety_score >= 50 THEN
    v_status := 'CAUTION';
  ELSE
    v_status := 'DENIED';
  END IF;

  -- Construct the payload to store in location_data (or we should have separate columns, but for MVP reusing this)
  v_payload := jsonb_build_object(
    'location', jsonb_build_object(
      'name', location_name,
      'coordinates', jsonb_build_object(
        'latitude', location_lat,
        'longitude', location_lng
      )
    ),
    'activity', jsonb_build_object(
      'type', activity_type,
      'startTime', to_char(start_time AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'endTime', to_char(end_time AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'participants', participants
    ),
    'contact', jsonb_build_object(
      'name', contact_name,
      'phone', contact_phone,
      'emergencyContact', emergency_contact
    ),
    'notes', notes,
    'companions', companions,
    'safety_analysis', analysis_data
  );

  INSERT INTO public.reports (user_id, location_data, status, safety_score)
  VALUES (v_user_id, v_payload, v_status, v_safety_score)
  RETURNING * INTO v_report;

  v_report_code := format(
    'RPT-%s-%s',
    to_char(v_report.created_at, 'YYYYMMDD'),
    LPAD(v_report.report_no::TEXT, 6, '0')
  );

  RETURN jsonb_build_object(
    'id', v_report.id,
    'reportId', v_report_code,
    'userId', v_user_id,
    'status', v_status,
    'safetyScore', v_safety_score,
    'submittedAt', v_report.created_at,
    'location', v_payload -> 'location',
    'activity', v_payload -> 'activity',
    'contact', v_payload -> 'contact',
    'notes', COALESCE(notes, ''),
    'companions', companions,
    'safety_analysis', analysis_data
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.submit_report(
  TEXT, DOUBLE PRECISION, DOUBLE PRECISION, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB, JSONB
) TO authenticated;

COMMIT;
