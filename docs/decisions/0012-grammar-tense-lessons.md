# 0012 — Grammar module: hand-written tense lessons

Date: 2026-09-15
Status: Accepted. Phase 1 (path + 6 lessons) built.

## Context

The grammar module starts with the English tenses, A1–C1, for Mongolian learners. Research (`docs/research/grammar-tenses-sources.md`) checked datasets and open material for reuse in a product that will become freemium:

- Grammar error correction corpora (W&I+LOCNESS, FCE, NUCLE, Lang-8, JFLEG) are non-commercial. CoEdIT is labelled Apache-2.0 but its grammar rows come from those corpora.
- Kaggle and Mendeley tense datasets have no clear origin or license.
- Publisher material (British Council, Cambridge, EF, Perfect English Grammar) cannot be copied.
- Tatoeba sentences are CC BY 2.0 FR / CC0 with per-sentence authors.
- The British Council–EAQUALS Core Inventory gives a clear A1–C1 tense order; using the level mapping as our own syllabus is low risk, copying its text is not.
- Research on Mongolian learners' tense errors is thin; what exists points to tense-form errors and continuous forms with state verbs.

## Decision

- **Syllabus**: our own 14-step tense path (`TENSE_PATH` in `src/lib/grammar/lessons.ts`), ordered after the Core Inventory level mapping. Steps without a lesson show "Тун удахгүй".
- **Content is written by hand**, as typed TypeScript in `src/content/grammar/<slug>.ts`: uses with Mongolian explanations, a timeline spec, form patterns, signal words, Mongolian-learner pitfalls and 8 exercises (`choice`, `type`, `pick`), each with a Mongolian explanation. Example sentences are original, so no attribution is needed.
- **Pages**: `/grammar` (path by level), `/grammar/[slug]` (lesson), `/grammar/[slug]/practice`.
- **Checking typed answers**: case, curly apostrophes, spacing and trailing punctuation are ignored, and contractions equal full forms (`isn't` = `is not`).
- **Tracker**: reading and practice log `module: "grammar"` with the slug as `ref` through `useMeasuredTime`, under the cumulative-points rule; the server caps a flush at 3600 s and requires a known slug.
- **Later sources**: Tatoeba for extra example sentences and generated exercises (with a credit line per sentence, reviewed by a person). Non-commercial corpora stay out of the product.

## Consequences

- No license risk in phase 1, and the quality of the Mongolian explanations is fully under our control.
- Each new tense is one content file plus a catalog entry; a scratch check validates answers and options.
- Content should be reviewed by an English teacher before wide launch, same as ADR 0011's sound tips.
- Progress and mistake review need a table (phase 3 of `docs/plans/grammar-tenses.md`).
