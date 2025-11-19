-- 2025-11-19: schema script for manual PSQL execution (Task 2.2+)
-- Run via: psql "postgresql://user:password@localhost:5432/postgres" -f supabase/sql/2_2_schema.sql

begin;

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users,
  full_name text,
  phone text,
  emergency_contact text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users,
  report_id text not null unique,
  location_name text not null,
  location_lat numeric(10,8) not null,
  location_lng numeric(11,8) not null,
  activity_type text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  participants integer not null,
  status text not null check (status in ('APPROVED','CAUTION','DENIED','EMERGENCY')),
  safety_score integer check (safety_score between 0 and 100),
  analysis_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists safety_zones (
  id uuid primary key default uuid_generate_v4(),
  zone_name text not null,
  zone_type text not null,
  boundary jsonb not null,
  restrictions jsonb,
  created_at timestamptz default now()
);

create sequence if not exists report_seq;

-- RLS policies
alter table profiles enable row level security;
create policy if not exists profiles_select_own on profiles for select to authenticated using (auth.uid() = user_id);
create policy if not exists profiles_insert on profiles for insert to authenticated with check (auth.uid() = user_id);
create policy if not exists profiles_update on profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table reports enable row level security;
create policy if not exists reports_select_own on reports for select to authenticated using (auth.uid() = user_id);
create policy if not exists reports_insert on reports for insert to authenticated with check (auth.uid() = user_id);
create policy if not exists reports_update_own on reports for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table safety_zones enable row level security;
create policy if not exists safety_zones_select on safety_zones for select to authenticated using (true);

-- helper function + trigger for updated_at
create function if not exists row_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger if not exists profiles_updated_at
  before update on profiles
  for each row
  execute procedure row_updated_at();

commit;
