-- Core foundation: profiles + append-only activity event log.
-- Points/streak rules: docs/decisions/0005-activity-log-points-streaks.md

-- ── profiles ────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 60),
  timezone text not null default 'Asia/Ulaanbaatar',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: update own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Auto-create a profile row for each new auth user.
-- SECURITY DEFINER is required (trigger writes across RLS); it returns
-- trigger so PostgREST cannot expose it, and search_path is pinned.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── activity_events (append-only) ───────────────────────────────────────────
create table public.activity_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  module text not null check (module in (
    'general','grammar','vocabulary','listening','reading',
    'writing','speaking','books','games','challenges'
  )),
  kind text not null default 'study' check (char_length(kind) <= 40),
  duration_sec integer not null default 0 check (duration_sec between 0 and 14400),
  points integer not null check (points between 0 and 1000),
  occurred_at timestamptz not null default now(),
  meta jsonb not null default '{}'::jsonb
);

create index activity_events_user_occurred_idx
  on public.activity_events (user_id, occurred_at desc);

alter table public.activity_events enable row level security;

create policy "activity_events: read own" on public.activity_events
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Append-only: insert of own rows only; no update/delete policies on purpose.
create policy "activity_events: insert own" on public.activity_events
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
