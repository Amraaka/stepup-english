-- Grammar progress + mistake review (grammar plan phase 3).
-- Decisions: docs/decisions/0012-grammar-tense-lessons.md, docs/decisions/0013-grammar-progress-review.md
-- Lessons live in the app; rows reference them by slug and by exercise key (its sentence or prompt).

create table public.grammar_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null check (char_length(slug) between 1 and 80),
  best_score smallint not null check (best_score >= 0),
  last_score smallint not null check (last_score >= 0),
  total smallint not null check (total > 0),
  attempts integer not null default 1 check (attempts > 0),
  -- first time the learner passed the lesson practice (70%+)
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, slug)
);

alter table public.grammar_progress enable row level security;

create policy "grammar_progress: read own" on public.grammar_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "grammar_progress: insert own" on public.grammar_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "grammar_progress: update own" on public.grammar_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table public.grammar_review (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null check (char_length(slug) between 1 and 80),
  item_key text not null check (char_length(item_key) between 1 and 300),
  -- Leitner box, same rules as saved_words: 0 = due again now … 6 = well known
  box smallint not null default 0 check (box between 0 and 6),
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, slug, item_key)
);

create index grammar_review_user_due_idx on public.grammar_review (user_id, due_at);

alter table public.grammar_review enable row level security;

create policy "grammar_review: read own" on public.grammar_review
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "grammar_review: insert own" on public.grammar_review
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "grammar_review: update own" on public.grammar_review
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "grammar_review: delete own" on public.grammar_review
  for delete to authenticated
  using ((select auth.uid()) = user_id);
