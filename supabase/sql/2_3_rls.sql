-- 2_3_rls.sql
-- Row Level Security policies for Supabase tables

BEGIN;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_zones ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
CREATE POLICY profiles_insert_self
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reports policies
DROP POLICY IF EXISTS reports_select_own ON public.reports;
CREATE POLICY reports_select_own
  ON public.reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS reports_insert_self ON public.reports;
CREATE POLICY reports_insert_self
  ON public.reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS reports_update_own ON public.reports;
CREATE POLICY reports_update_own
  ON public.reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Safety zones policies (read-only public access)
DROP POLICY IF EXISTS safety_zones_select_public ON public.safety_zones;
CREATE POLICY safety_zones_select_public
  ON public.safety_zones
  FOR SELECT
  TO public
  USING (true);

COMMIT;
