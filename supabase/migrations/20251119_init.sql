-- 2025-11-19 initial schema

create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  full_name text,
  phone text,
  emergency_contact text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "profiles_select_own" on profiles for select to authenticated using (auth.uid() = user_id);
create policy "profiles_insert" on profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "profiles_update" on profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
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

alter table reports enable row level security;
create policy "reports_select_own" on reports for select to authenticated using (auth.uid() = user_id);
create policy "reports_insert" on reports for insert to authenticated with check (auth.uid() = user_id);
create policy "reports_update_own" on reports for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table safety_zones (
  id uuid primary key default uuid_generate_v4(),
  zone_name text not null,
  zone_type text not null,
  boundary jsonb not null,
  restrictions jsonb,
  created_at timestamptz default now()
);

alter table safety_zones enable row level security;
create policy "safety_zones_select" on safety_zones for select to authenticated using (true);

create sequence report_seq;

create function row_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row
  execute procedure row_updated_at();
*** End Patch