# 0021 — Reading by topic, open-licensed texts and a two-pass content check

Date: 2026-09-18
Status: Accepted. Extends ADR 0017. Research: `docs/research/reading-graded-topic-sources.md`.

## Context

`/reading` had 5 VOA texts sorted only by level. Learners should be able to pick what interests them and read at their level, which needs many short texts labelled by topic and level. The research found that ready-made CEFR datasets (Hugging Face, Kaggle, GitHub) are research-only, non-commercial or scraped, so none is safe for a freemium app. Openly licensed publisher texts can be used if we assign levels ourselves.

## Decision

### Sources (commercial use and adaptation allowed)
- **VOA Learning English**, VOA-written pieces only (public domain). Items "adapted from" AP, AFP or Reuters reports are rejected, because those agencies own the original text. The 5 existing texts were re-checked; all are VOA-written.
- **LIDA Stories UK**: CC BY 4.0 stories only. The 12 CC BY-NC-SA stories are excluded. Adult-learner stories, A1–B1.
- **Frontiers for Young Minds** (CC BY 4.0) excerpts and **Wikinews** (CC BY 2.5 / 4.0) articles, B2–C1.
- **Standard Ebooks** short stories (US public domain, CC0 transcriptions).
- Not used yet, pending the owner's decision: StoryWeaver (children's content), Simple English Wikipedia (CC BY-SA).
- Levels are our own judgement for an EFL reader, not the publisher's label.

### Topics
- 12 topics in `src/lib/reading/topics.ts` (ids mirrored in `build_text.py`): daily life, food, health, work & money, school, travel, nature, science, technology, history & people, culture, stories. Each text has exactly one.
- `/reading` has two rows of link chips (`?topic=` and `?level=`, server-rendered, no client state). Without a topic, texts are grouped under each topic that has some. Within a group the learner's level comes first (ADR 0015). Topics with no texts at the chosen level are hidden. An empty result gets a short message and a link to all levels.

### Content pipeline
- Each text is `scripts/reading/sources/<slug>.txt` (as published) and `<slug>.meta.json` (title, Mongolian summary, level, topic, source with licence and credit, `changes` for CC BY, 3 questions).
- `build_text.py` checks every meta file (enums, licence, 3 questions, answer in range, CC BY needs `licenseUrl` and `changes`) and writes one `src/content/reading/catalog.json`. The per-text paragraph files are gone. `texts.ts` reads the catalog.
- The reader's credit line links the CC BY licence and states what was changed.

### Two-pass check (glosses and questions)
1. **Draft**: agents copy texts and write questions. Missing words are split into chunks, glossed with example sentences, and merged with `merge_glosses.py`. The script never overwrites without `--replace` and keeps the file's hand-kept layout. Inflections made into lemmas are then folded back into their base, with the missing sense added to the base.
2. **Independent review**, by agents that didn't write the draft:
   - `quiz_view.py` prints the questions with shuffled options and no answers. The reviewer answers from the text alone, and any disagreement means the question is rewritten.
   - `gloss_view.ts` prints every sentence with the meaning a learner would see for each word, so senses are checked in context. Fixes add senses rather than replace them.
   - Summaries, explanations and text hygiene are checked too.
- `coverage.ts` must report no missing words before publishing.

## Consequences

- The dictionary grew from 847 to about 3,000 lemmas. Pages still load only their own slice (ADR 0016).
- The glosses and questions are still machine-written. The owner reads the Mongolian, and an English teacher spot-checks before launch.
- VOA Learning English stopped publishing in 2025. Our copies in `scripts/reading/sources/` are what we publish from.
- Thin areas: A1 (LIDA's shortest stories are under 60 words), C1, and sport. They need more sources or reviewed, clearly labelled original texts.
