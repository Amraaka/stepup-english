# 0020 — Finished reading texts, listening practice and shadowing

Date: 2026-09-17
Status: Accepted

## Context

ADR 0019 made `/learn` show per-skill progress, but only grammar recorded a finished lesson. Reading, listening and shadowing could only count items the learner had *opened* (any measured time), which overstates progress.

## Decision

- **One table for all three**: `public.content_progress (user_id, module, ref)` with best and last score, total, attempts and `completed_at`, the same shape and RLS as `grammar_progress` (ADR 0013). `module` is `reading`, `listening` or `speaking`; `ref` is the text or clip slug.
- **Same pass mark as grammar**: an item is finished from the first attempt at 70% or more (`PASS_RATIO`). Later attempts keep the best score and never un-finish it.
- **Graded on the server**, like grammar:
  - Reading: the client sends the chosen option *texts* in question order, so the day's option shuffle doesn't matter.
  - Listening practice: the client sends `{ id, answer }` per item. The server rebuilds the day's seeded set (or yesterday's, for a session that crossed midnight), requires the same item ids in the same order, and grades questions and gaps by text and dictation with `checkDictation`.
  - Shadowing: there is no right answer, so the score is how many of the clip's sentences the learner recorded, out of all of them. This count comes from the client; it earns no points, so it isn't checked further.
- **Feedback**: the result screen shows "Дууссан гэж тэмдэглэгдлээ", "70%-иас дээш бол дууссанд тооцогдоно", or asks guests to sign in (guests' results aren't saved, as in grammar).
- **Where it shows**: `/learn` counts finished items and suggests the first unfinished one at the learner's level ("Үргэлжлүүлэх" if already opened); the reading, listening and speaking lists mark finished items with a check and show the best score.

## Consequences

- Points and time are unchanged: they still come from measured time (ADR 0015).
- Rewording a question or changing a clip's practice set changes `total`, which resets the best score for that item, as in grammar.
