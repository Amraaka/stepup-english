# 0013 — Grammar progress and mistake review

Date: 2026-09-15
Status: Accepted. Built locally; the migration is not applied to hosted Supabase yet.

## Context

Grammar lessons (ADR 0012) had practice but kept nothing. Learners need to see which tenses they finished, where to go next, and to meet their mistakes again, like saved words in ADR 0010.

## Decision

- **`grammar_progress`** (one row per user + lesson slug): best score, last score, total, attempts, `completed_at`. A lesson is completed the first time practice reaches 70% (`PASS_RATIO`); it stays completed after weaker retries.
- **`grammar_review`** (one row per user + lesson slug + exercise key): Leitner box and due date, with the same `BOX_DAYS`, `nextReview` and daily cap of 20 as saved words.
  - The **exercise key** is the exercise's sentence (or prompt + options for `pick`), not its index, so lessons can be reordered. A reworded or removed exercise no longer resolves and its review row is deleted when the queue is built.
  - A wrong answer in lesson practice upserts the item to box 0, due now. Review answers move it up a box or back to 0.
- **Server actions** (`src/app/(site)/grammar/actions.ts`): `finishPracticeAction` requires sign-in and exactly one answer per exercise of a known lesson; `reviewGrammarAction` requires the item to exist. Correctness is reported by the client — acceptable for self-study scores that earn no points of their own (points come only from logged time).
- **UI**:
  - `/grammar` shows "N/15 хичээл дууссан", a check and best score on completed lessons, a "Дараагийнх" marker on the first unfinished lesson, and "Алдаагаа давтах" when items are due. Lessons are never locked.
  - `/grammar/review` runs due items through the same practice component; the session keeps its items from mount so revalidation can't change it.
  - Guests practise as before and see a sign-in prompt on the finish screen; nothing is stored for them.
- **Tracker**: review time logs as `grammar` with `ref: "review"`.

## Consequences

- Hosted deploy needs `20260915070000_grammar_progress.sql` (and `20260915060000_saved_words.sql`).
- Rewording an exercise silently drops it from learners' review queues; that is preferred over showing a changed question as a "mistake".
- Guest progress is not imported on sign-up (unlike guest time logs). Can be added later if guests practise a lot before signing up.
