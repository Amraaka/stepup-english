-- Review history for saved words and grammar mistakes (skill modules plan, step 0).
-- Decision: docs/decisions/0015-groundwork-review-log-levels-timed-targets.md
-- Append-only: one row per answer in a word or mistake review. Used later for
-- hard-word lists (lapses) and for fitting FSRS (ADR 0010 alternative).

create table public.review_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  item text not null check (item in ('word', 'grammar')),
  -- word: the lemma (stable after the saved row is deleted); grammar: "<slug>|<item_key>"
  item_ref text not null check (char_length(item_ref) between 1 and 400),
  correct boolean not null,
  box_before smallint not null check (box_before between 0 and 6),
  box_after smallint not null check (box_after between 0 and 6),
  reviewed_at timestamptz not null default now()
);

create index review_log_user_reviewed_idx on public.review_log (user_id, reviewed_at desc);

alter table public.review_log enable row level security;

create policy "review_log: read own" on public.review_log
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "review_log: insert own" on public.review_log
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
