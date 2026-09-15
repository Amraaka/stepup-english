# Grammar module — tenses development plan

Date: 2026-09-15
Research: `docs/research/grammar-tenses-sources.md`. Decision record: ADR 0012.

## Goal

A learner opens `/grammar` and follows one ordered path through every English tense, from A1 to C1. Each tense is a short lesson in Mongolian followed by practice that checks it. Time spent logs to the tracker automatically, like listening.

## Phases

| Phase | Outcome | Status |
|---|---|---|
| **1. Tense path + first 6 lessons** | `/grammar` path, lesson page, practice, auto time logging. Lessons: Present Simple, Present Continuous, Past Simple, Past Continuous, Present Perfect, will / going to. | Done |
| 2. Remaining tenses | Present Perfect Continuous, Past Perfect, used to / would, Future Continuous, Future Perfect, Past Perfect Continuous, Future Perfect Continuous, was going to / would, and a Past Simple vs Present Perfect contrast lesson. Present tenses for the future are covered inside the Present Simple / Continuous lessons; will vs going to is its own lesson. | Done |
| 3. Progress + mistake review | `grammar_progress` and `grammar_review` tables (ADR 0013). Wrong answers become Leitner review items at `/grammar/review`. Path shows done / next / due mistakes. | Done (local DB only) |
| 4. Mixed tense checks | Level checkpoints that mix tenses; auto-generated items from licensed example sentences (depends on research). | Planned |

## Lesson format (phase 1)

Content lives in `src/content/grammar/<slug>.ts`, typed by `src/lib/grammar/types.ts`. Everything is written by hand: Mongolian explanations cannot come from a dataset, and example sentences are original so no attribution is needed.

A lesson has, in order:

1. **Хэзээ хэрэглэх вэ** — 2–4 uses, each with a Mongolian explanation and English examples with Mongolian translations.
2. **Цагийн шугам** — a timeline (past · now · future) drawn from a small spec: dots, repeated dots, spans, arrows.
3. **Хэлбэр** — positive, negative, question patterns with one example each.
4. **Дохио үгс** — signal words (*every day, now, yesterday, already …*).
5. **Анхаарах алдаа** — common mistakes by Mongolian learners, wrong → right with a short note.
6. **Дасгал** — 8 items: `choice` (fill the blank from options), `type` (write the verb form), `pick` (choose the correct sentence). Each item explains its answer in Mongolian.

## Tracker

- Lesson reading and practice count as `grammar` time with the lesson slug as `ref` (`TimedTarget`), through `useMeasuredTime`. Same cumulative 3-hour points window and 60 s minimum.
- Server cap per flush: 3600 s; the slug must exist in the catalog. Guests log to the guest store.

## Verify

Typecheck and lint; a scratch script that checks every lesson (answers are among options, `type` answers non-empty, 8 items, no duplicate options); screenshots at 390×844 and 1440×900; practice run that logs `grammar` time.

## Phase 1 progress (2026-09-15)

- Built: the path (14 steps, 6 with lessons), lesson page with an SVG timeline, practice with `choice` / `type` / `pick` items and Mongolian explanations, `grammar` time logging.
- Verified:
  - Scratch check: 6 lessons, 8 items each, answers in options, unique options, typed-answer normalisation (contractions, curly apostrophes, case).
  - 390×844 as a member: Past Continuous lesson renders every section; Present Perfect practice showed wrong-answer feedback, accepted `hasn’t finished` for `has not finished`, finished at 7/8 and logged `grammar` / `present-perfect` (90 s, 10 points).
  - 1440×900: grammar path page.
- Not verified: desktop lesson and practice screenshots, dark mode, guest logging.
- Content review by an English teacher is still needed.

## Phase 2 progress (2026-09-15)

- Built: 9 more lessons, so the path now has 15 steps, all written. `TENSE_PATH` is derived from `LESSONS`.
- Verified:
  - Scratch check passes for all 15 lessons (8 items each, answers in options, unique options, typed answers self-check).
  - Typecheck and lint clean.
  - At 390×844, every lesson page renders its timeline with no overlapping or clipped labels (checked by measuring text boxes); the was going to / would timeline was checked by eye. No console errors.
- Not verified: practice runs for the 9 new lessons in a browser (they use the same component as phase 1), desktop screenshots.
- The Mongolian explanations and B2–C1 example sentences still need review by an English teacher.

## Phase 3 progress (2026-09-15)

- Built: migration `20260915070000_grammar_progress.sql` (applied locally), `src/lib/grammar/progress.ts`, grammar actions, progress on the path page, `/grammar/review`, finish-screen messages for saved results and guests.
- Verified at 390×844 as a member:
  - Present Simple practice with 2 wrong answers finished at 6/8, showed "Алдсан 2 асуулт давталтад нэмэгдлээ", and wrote `grammar_progress` (best 6/8, completed) plus 2 `grammar_review` rows in box 0.
  - `/grammar` showed 1/15 done, a check with "шилдэг 6/8", "Дараагийнх" on Present Continuous and "Алдаагаа давтах · 2 асуулт".
  - The review session showed both items; the right answer moved to box 1 (due later), the wrong one stayed in box 0.
- Not verified: guest finish screen in a browser, the daily review cap, desktop screenshots, hosted Supabase.

## Out of scope for phase 1

Saved progress, mistake review, AI explanations, placement-based starting point (the path starts at the learner's onboarding level later).
