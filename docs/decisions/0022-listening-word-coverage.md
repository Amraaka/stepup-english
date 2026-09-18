# 0022 — "How much will I understand?": word coverage per clip

Date: 2026-09-18
Status: Accepted. Builds on ADR 0010, 0015, 0016. Idea 1 of the vault note "Сонсголын 5 санаа".

## Context

A learner who picks a clip that's too hard concludes that their listening is bad, when the real gap is vocabulary. Comprehension rises sharply once 95–98% of the running words are known (Hu & Nation 2000; van Zeeland & Schmitt 2013 for listening). We already know each word's lemma (the shared dictionary), the learner's self-assessed level, and which words they saved and how well they remember them. That is enough to estimate coverage without a vocabulary test.

## Decision

### Estimate (`src/lib/dictionary/coverage.ts`)
- Each dictionary lemma gets a frequency rank: wordfreq's frequency of the lemma plus its dictionary forms and British spellings, ranked against English word forms (`scripts/dictionary/build_frequency.py` → `src/content/dictionary/frequency.json`). wordfreq data is CC BY-SA 4.0; only the derived ranks are stored.
- A word is **known** when:
  - it's a name or a number, or
  - it's saved and in Leitner box 3 or higher (a saved word below box 3 counts as unknown), or
  - it's not saved and ranks within the learner's level cutoff.
- Cutoffs by word-form rank: A1 1,500 · A2 3,000 · B1 5,000 · B2 8,000 · C1 12,000. `scripts/dictionary/calibrate.ts` shows the 50 graded reading texts at a median 95–96% for their own level with these values.
- Guests and "not sure" learners are treated as A2, and the list says so.
- Bands: **Яг тохирно** ≥ 95%, **Сорилт** 90–94%, **Одоохондоо хэцүү** < 90%. Percent is rounded down.
- New words are distinct unknown lemmas, ordered by count in the clip, then by English frequency.

### UI
- `/listening`: each clip card shows a ring with the percent, the band pill, and the number of new words for non-fitting clips. Clips are sorted by band.
- Player: the header shows "N% мэддэг үг · band". Before the first play, a "Сонсохоос өмнө" card lists the top 3 new words with meaning, TTS and the clip sentence. Tapping a word opens the usual word sheet (save to review). "Сонсож эхлэх" plays; "Мэднэ" or any play dismisses it.

## Consequences

- An estimate, not a measurement: it trusts the self-assessed level. A placement test would replace the level cutoff later.
- "Мэднэ" doesn't record anything yet. Recording known/unknown taps per word would sharpen the estimate.
- The function takes plain sentences, so reading can show the same ring later.
- Re-run `build_frequency.py` after merging new glosses, or new lemmas count as rare.
