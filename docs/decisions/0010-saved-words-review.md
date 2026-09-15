# 0010 — Saved words and spaced review

Date: 2026-09-15
Status: Accepted

## Context

Phase 2 of the listening plan (`docs/plans/listening-phase-1.md`): a learner
who taps a word in a clip should be able to keep it and review it later.
ADR 0009 fixed three constraints. Saving needs an account. A card must work
from text and TTS alone. Reviews must not pile up into a scary backlog.

## Decision

- **Table `saved_words`** (`20260915060000_saved_words.sql`) holds one row per
  learner and lemma (`unique (user_id, lemma)`). Each row stores the surface
  form, the sentence and `source` `{clip, seg}`, plus review state (`box`,
  `due_at`, `last_reviewed_at`). RLS lets a learner read, insert, update and
  delete only their own rows. Server actions still filter by user id
  (ADR 0005 access model).
- **Meanings are not stored.** The app glossary, keyed by lemma, is the only
  source, so fixing a meaning also fixes every saved card. A card whose lemma
  has left the glossary still shows its sentence.
- **Saving** comes from the word sheet. Saving the same lemma again is a
  no-op. Guests see a sign-up prompt instead of the save button.
- **Review is Leitner, with two buttons**:
  - "Санасан" moves a card up one box, to at most box 6. The next review is
    due after 1, 3, 7, 14, 30 or 60 days for boxes 1–6.
  - "Мартсан" puts the card back in box 0 and due now, so it comes back
    later in the same session.
  - The card front shows the word, a TTS button (`speechSynthesis`, en-US)
    and the sentence. The meaning appears after "Утгыг харах".
- **Daily cap**: at most 20 distinct cards per local day, counted by
  `last_reviewed_at`. New saves are due at once but share the cap.
- **Tracker**: review time is measured the way listening time is (visible
  tab, at least 60 s). It logs as `module: "vocabulary"`, `kind: "timed"` and
  `ref: "review"`, with the cumulative-points rule from ADR 0009.
- **`/vocabulary`** replaces its "coming soon" placeholder with the saved
  word list and a review button. The review runs at `/vocabulary/review`.

## Rejected alternatives

- **SM-2 / Anki ease factors**: four answer buttons and per-card ease are
  too much for new adult learners. Leitner is easy to explain and to change
  later, because the box and due date already live on the row.
- **Storing the meaning on the row**: glossary fixes would not reach saved
  cards.
- **Guest saves in localStorage**: they would need another import path at
  onboarding. Asking for an account at the moment of saving is also a
  natural sign-up prompt.

## Consequences

- Cards that are due beyond the cap wait until tomorrow. The home page can
  show "N үг давтах" later.
- Clip audio on cards (phase 4) can use `source.clip` and `source.seg`
  without a schema change.
