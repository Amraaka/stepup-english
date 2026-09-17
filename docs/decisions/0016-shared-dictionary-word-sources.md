# 0016 — Shared dictionary, word sources and tap-to-translate

Date: 2026-09-16
Status: Accepted. Step 2 of `docs/plans/skill-modules-integration.md` (P1, P2, P3).

## Context

Words, meanings and tap-to-translate were built for listening (ADR 0009, 0010):

- the only dictionary was `src/content/listening/glossary.json`, built from two clips;
- `saveWordAction` accepted a word only when its clip existed, and `saved_words.source` could only say `{clip, seg}`;
- word lookup, phrase expansion and saving lived inside `ClipPlayer`.

Reading (ADR 0017), word lists and writing feedback all need the same pieces.

## Decision

### One dictionary
- The glossary moves to `src/content/dictionary/glossary.json`, with `src/lib/dictionary/glossary.ts` (same functions: `wordKey`, `lookupWord`, `phraseAt`, `entryForLemma`) and `src/lib/dictionary/types.ts` (`GlossEntry`, `PartOfSpeech`). Files were moved with `git mv`; the JSON shape is unchanged.
- ADR 0010's rule stays: meanings are not stored on saved rows.
- Every word in a published text or clip needs an entry (directly, through `forms`, or inside a tagged phrase). `scripts/reading/coverage.ts` checks reading texts and exits with 1 when something is missing.

### Word sources
- `SavedWordSource` is a tagged union: `{ kind: "clip", clip, seg? } | { kind: "text", text, para }`. The column is jsonb, so no migration.
- Rows saved before this ADR are `{clip, seg}` without `kind`. `StoredWordSource` types what the column may hold, and `readSource()` in `src/lib/vocab/words.ts` reads old rows as clips.
- `saveWordAction` takes `source` from the client and checks it against the catalog: the clip or text must exist and `seg` / `para` must be in range. The lemma must still be in the dictionary.
- A card no longer carries `clip`; it carries `from: { title, href }` (the clip or text page), and `audio` only for clips.

### Tap-to-translate
- `useWordPick` (`src/components/words/use-word-pick.tsx`) holds lookup with phrase expansion, the word sheet and saving. Callers pass sentences as token lists and `source(i)` for sentence i, plus optional `onOpen` / `onClose` (the clip player pauses and resumes).
- `TappableTokens` renders one sentence of tappable words with tone classes passed in whole.
- `WordSheet` moves to `src/components/words/`.

### Per-page dictionary slices (amended 2026-09-16)
- `src/lib/dictionary/glossary.ts` (the JSON) is server side only. `src/lib/dictionary/lookup.ts` holds `wordKey`, `POS_LABEL` and `makeLookup(glossary)` with no data, so client components can import it.
- `glossaryFor(sentences)` builds the slice a page needs: every lemma and form its tokens use (including `'s`) and every dictionary phrase that matches in it, kept in the full file's order so phrase choice is identical. Listening and reading pages pass it to `ClipPlayer` / `TextReader` → `useWordPick`.
- Review cards carry `entry`, resolved on the server, so the review never loads the dictionary.
- Measured on the local dev server: before, the whole dictionary sat in a client chunk (144 KB on `/reading/pearl-buck`, 199 KB on `/listening/george-washington`); after, no client chunk contains dictionary text and each page's HTML carries its slice (9–15 KB, 17–27% of the 54 KB file). A check over all 5 texts and 2 clips found slice lookups (word and phrase) identical to the full dictionary for every token.

## Consequences

- Listening behaves as before: tap, phrase expansion, pause/resume and saving were checked in the browser, and a new save stored `{kind: "clip", clip, seg}`.
- The dictionary can grow (word lists, more texts) without growing any page's JavaScript; a page's slice grows only with its own content.
- Importing `@/lib/dictionary/glossary` from a client component would bring the whole file back into the bundle; client code imports `@/lib/dictionary/lookup`.
- Word lists (`kind: "list"`), writing feedback (`kind: "writing"`) and manual adds (`kind: "manual"`) join the union when those features are built.
