-- Saved words + spaced review (listening phase 2).
-- Decisions: docs/decisions/0009-listening-module-content-and-player.md, 0010-saved-words-review.md
-- Meanings are not stored: the glossary in the app is the source, keyed by lemma.

create table public.saved_words (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  lemma text not null check (char_length(lemma) between 1 and 80),
  surface text not null check (char_length(surface) between 1 and 80),
  sentence text not null default '' check (char_length(sentence) <= 400),
  -- where it was saved, e.g. {"clip": "yellowstone", "seg": 3}
  source jsonb not null default '{}'::jsonb,
  -- Leitner box: 0 = new/forgotten … 6 = well known
  box smallint not null default 0 check (box between 0 and 6),
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, lemma)
);

-- Review queue: a learner's due cards, soonest first.
create index saved_words_user_due_idx on public.saved_words (user_id, due_at);

alter table public.saved_words enable row level security;

create policy "saved_words: read own" on public.saved_words
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "saved_words: insert own" on public.saved_words
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "saved_words: update own" on public.saved_words
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "saved_words: delete own" on public.saved_words
  for delete to authenticated
  using ((select auth.uid()) = user_id);
