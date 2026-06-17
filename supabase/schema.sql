-- GCSEase — Supabase schema
-- Run this once in your Supabase project: SQL Editor → paste → Run.
-- It creates the two tables the app uses and locks them down with Row Level
-- Security so each signed-in user can only ever read/write their OWN rows.

-- 1) Profile fields shown in the UI (name, chosen board, chosen tier).
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text,
  board       text,
  tier        text,
  created_at  timestamptz not null default now()
);

-- 2) The student's progress + checklist blob (one row per user).
create table if not exists public.user_data (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Row Level Security ----------------------------------------------------------
alter table public.profiles  enable row level security;
alter table public.user_data enable row level security;

-- profiles: a user may see and manage only their own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- user_data: same, keyed on user_id
drop policy if exists "user_data_select_own" on public.user_data;
create policy "user_data_select_own" on public.user_data
  for select using (auth.uid() = user_id);

drop policy if exists "user_data_insert_own" on public.user_data;
create policy "user_data_insert_own" on public.user_data
  for insert with check (auth.uid() = user_id);

drop policy if exists "user_data_update_own" on public.user_data;
create policy "user_data_update_own" on public.user_data
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
