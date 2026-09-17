-- Finished reading texts, listening practice and shadowing (ADR 0020).
-- Items live in the app; rows reference them by module + slug, like grammar_progress.

create table public.content_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  module text not null check (module in ('reading', 'listening', 'speaking')),
  ref text not null check (char_length(ref) between 1 and 80),
  best_score smallint not null check (best_score >= 0),
  last_score smallint not null check (last_score >= 0),
  total smallint not null check (total > 0),
  attempts integer not null default 1 check (attempts > 0),
  -- first time the learner reached the pass mark (70%+)
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, module, ref)
);

alter table public.content_progress enable row level security;

create policy "content_progress: read own" on public.content_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "content_progress: insert own" on public.content_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "content_progress: update own" on public.content_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
