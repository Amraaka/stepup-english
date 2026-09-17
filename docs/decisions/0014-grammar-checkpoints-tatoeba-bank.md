# 0014 — Grammar level checkpoints and the Tatoeba item bank

Date: 2026-09-15
Status: Accepted. Built locally; bank items reviewed by Claude only, teacher review pending.

## Context

Lesson practice (ADR 0012) checks one tense at a time with hand-written items. Learners also need to choose between tenses, and the lessons alone give 8 items per tense. Research (`docs/research/grammar-tenses-sources.md`) found Tatoeba (CC BY 2.0 FR / CC0, per-sentence authors) to be the clean source of real example sentences.

## Decision

### Item bank from Tatoeba

- `scripts/grammar/build_bank.py candidates --data DIR` reads the Tatoeba English exports (detailed + CC0) and keeps only one-clause statements shaped `<Subject> <verb phrase> … <time signal>.`:
  - subjects I / you / we / they / he / she / it / Tom / Mary; no contractions, negatives, questions or second clauses;
  - a verb table of ~90 verbs written by hand (no be / have / do / get, no verbs whose past equals the base);
  - exactly one time signal: past (*yesterday, last …, … ago, in 2013*), now (*right now, at the moment, at present*), since (*since 2013, since childhood …*), future (*tomorrow, next …*).
- **One correct option by construction**: the signal decides which tenses may be the answer, and the three wrong options are the same verb and subject in tenses the signal rules out (e.g. *yesterday* → *will find / find / have found* against *found*). Future signals never use the past continuous as a wrong option, because *We were going to a dance tomorrow* is a correct future in the past; they use the past perfect instead. Explanations are Mongolian templates per signal and answer tense, saying why the answer's form fits.
- Up to 25 candidates per tense + signal go to `scripts/grammar/candidates.json`. A person accepts or rejects them in `scripts/grammar/reviewed.json`; `build_bank.py bank` rebuilds each accepted item from its sentence with the current rules (so rule or template changes need no new Tatoeba download) and fails if an accepted sentence no longer passes.
- Each item keeps `tatoebaId`, author and license, and the practice screen shows "Өгүүлбэр: Tatoeba #id (өөрчилсөн) · author · license" with a link, as CC BY requires; the gap-fill is marked as adapted.
- First bank: 77 items over 7 tenses (past simple, past continuous, present continuous for now and for arrangements, will / going to, future continuous, present perfect, present perfect continuous). The first review was done by Claude; an English teacher must review before launch.

### Level checkpoints

- `/grammar/checkpoint/[level]` (a1 … c1): 12 items, seeded by level + day in the learner's profile timezone (Asia/Ulaanbaatar for guests), so the set is stable all day and changes daily.
- `pickCheckpoint` takes up to half from the level's bank items, at most 2 per lesson so a tense with a big bank doesn't fill the test, and the rest round-robin across the level's lessons, so every tense of the level appears. C1 has no bank items yet and uses lesson items only.
- The question header shows "<level> шалгалт", not the lesson title, which would give the tense away.
- Results are saved in `grammar_progress` under `checkpoint-<level>` (passed at 70%); wrong answers enter `grammar_review` under the item's own lesson, and `findItem` resolves bank items too.
- The server accepts exactly 12 distinct answers that all belong to the level's pool (not the exact daily set, so a session crossing midnight still saves).
- The path shows a checkpoint card after each level. Time logs as `grammar` with `ref: checkpoint-<level>`.

## Consequences

- Rerunning the candidates step on a newer Tatoeba export can change which candidates appear; reviewed ids that no longer appear make the bank step fail loudly instead of shipping unreviewed items.
- Bank items only cover tenses with clear time signals. Perfect-future and future-in-the-past forms remain hand-written.
- `src/lib/random.ts` now holds the seeded RNG shared by listening practice and checkpoints.
