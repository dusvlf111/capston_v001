-- 2_5_trigger.sql
-- Automatically create profile rows when new auth users are registered

BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta JSONB := NEW.raw_user_meta_data;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, emergency_contact)
  VALUES (
    NEW.id,
    COALESCE(meta ->> 'full_name', meta ->> 'fullName'),
    COALESCE(meta ->> 'phone'),
    COALESCE(meta ->> 'emergency_contact', meta ->> 'emergencyContact')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    emergency_contact = EXCLUDED.emergency_contact,
    updated_at = timezone('utc', now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

COMMIT;
