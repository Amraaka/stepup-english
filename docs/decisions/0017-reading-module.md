# 0017 — Reading module: texts, reader and questions

Date: 2026-09-16
Status: Accepted. Step 2 of `docs/plans/skill-modules-integration.md` (R1, R3). Glosses and questions drafted by Claude; English teacher review pending before launch.

## Context

`/reading` was a "coming soon" page. The competitor study recommends a tap-to-translate reader with prepared Mongolian glosses (not a live translation call per tap, because Mongolian machine translation is weak) and short comprehension questions. ADR 0016 made the dictionary, word sources and tap-to-translate reusable.

## Decision

### Content
- **Source:** VOA Learning English articles that VOA produced itself (public domain, credit VOA). Photos are not used, so agency photo credits (AP) don't apply. First five texts: Pearl S. Buck (A2), The Story of Jack Frost (B1), How to Write a Good Email (B1), American Places – Gettysburg (B1), Start New Year by Setting Reasonable Learning Goals (B2).
- **Pipeline:** the published text is copied to `scripts/reading/sources/<slug>.txt` (one paragraph per line). Headings, audio links, sign-offs ("I'm John Russell."), credit lines and missing images are left out; a bulleted list becomes one sentence. `scripts/reading/build_text.py` splits sentences like listening transcripts, rejoins splits after middle initials ("Pearl S. Buck") and separates words glued by "…", "—" or "/", then writes `src/content/reading/<slug>.json` (paragraphs → sentences → tokens).
- **Catalog:** `src/lib/reading/texts.ts` holds title, Mongolian summary, CEFR level, source and 3 questions per text, like the clip catalog.
- **Glosses:** every tappable word needs a dictionary entry (`scripts/reading/coverage.ts`). The first batch was drafted by Claude and reviewed for sense in context; an English teacher must review before launch.

### Pages
- `/reading`: texts with the learner's own level first (ADR 0015 `cefrFor`), then by level; estimated minutes (120 words a minute) and, for members, minutes already read.
- `/reading/[slug]`: the text with tappable words (`useWordPick`), the word sheet and saving with source `{kind: "text", text, para}`, a link to the questions and the credit line.
- `/reading/[slug]/questions`: multiple-choice questions with Mongolian explanations, score and retry. Results are not saved.

### Time
- Reading logs `module: "reading"` with the text slug as `ref`, under the cumulative-points rule (ADR 0009).
- A second counts while the tab is visible and the learner scrolled, tapped or pressed a key in the last 2 minutes. Questions count while unfinished.
- `readingCapSec`: one flush may claim at most three slow readings of the text, and at least 10 minutes. The server registry (ADR 0015) uses the same function.

### Home grid
- `Skill.live` marks modules with working content; the skill grid shows "Тун удахгүй" only for modules that aren't live (now only writing).

## Consequences

- Word colours and a known-word count (R4), a Mongolian translation toggle (R5), listen-while-reading (R6) and more texts (R2) build on this catalog.
- Question results aren't saved; if they should count toward progress later, they need a table like `grammar_progress`.
- VOA texts change or disappear; the source files in `scripts/reading/sources/` are the copy we publish from.
