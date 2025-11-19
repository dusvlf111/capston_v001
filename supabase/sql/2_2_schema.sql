-- 2_2_schema.sql
-- PostgreSQL schema for Supabase remote database

BEGIN;

-- Ensure uuid generation is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sequence used for human-readable report numbers
CREATE SEQUENCE IF NOT EXISTS public.report_seq
  AS BIGINT
  INCREMENT BY 1
  MINVALUE 1000
  START WITH 1000;

-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- 자율 신고 테이블
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_no BIGINT NOT NULL DEFAULT nextval('public.report_seq'),
  location_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'CAUTION' CHECK (status IN ('APPROVED', 'CAUTION', 'DENIED')),
  safety_score INTEGER CHECK (safety_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_report_no ON public.reports(report_no);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);

ALTER SEQUENCE public.report_seq OWNED BY public.reports.report_no;

-- 안전 구역 테이블
CREATE TABLE IF NOT EXISTS public.safety_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL,
  zone_type TEXT NOT NULL,
  boundary JSONB NOT NULL,
  restrictions JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

COMMIT;
