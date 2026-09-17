-- Pronunciation assessment usage, for a per-user daily quota on the paid speech service.
-- Decision: docs/decisions/0011-shadowing-and-pronunciation-scoring.md; quota added after the Sep 2026 bug audit.
-- Append-only: one row per request sent to the provider. Written by the server action only.

create table public.pronunciation_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index pronunciation_usage_user_created_idx on public.pronunciation_usage (user_id, created_at desc);

alter table public.pronunciation_usage enable row level security;

create policy "pronunciation_usage: read own" on public.pronunciation_usage
  for select to authenticated
  using ((select auth.uid()) = user_id);
