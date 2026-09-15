# Listening module — development plan

Date: 2026-09-15
Decision record: ADR 0009. Research: `docs/research/listening-content-sourcing.md`.

## Phases

| Phase | Outcome | Status |
|---|---|---|
| **1. Hosted clip player** | A learner opens `/listening`, picks a clip, listens with a synced transcript, taps a word to see its Mongolian meaning, replays sentences, slows to 0.75x, hides the transcript. Listening time logs to the tracker automatically. | In progress |
| 2. Saved words + flashcards | Save a word from the tap sheet (members). Daily SRS review with "Санасан / Мартсан", sentence + TTS, daily cap 20. | Done (ADR 0010) |
| 3. Active listening | Dictation and gap-fill generated from transcripts. 3 optional questions after a clip. | Done |
| 4. Shadowing | Record yourself per sentence and compare with the original. Clip audio on flashcards (hosted content only). | Done (ADR 0011) |
| 5. Paid AI | Pronunciation scoring with Mongolian explanations. | Built, switched off: no provider key or paid access yet (ADR 0011) |
| — YouTube embed backend | CC BY / permission-granted embeds with the embed-safe feature set. | After phase 2 |

## Phase 1 — steps

1. **Content format** — `src/content/listening/<slug>.json`, typed by `src/lib/listening/types.ts`:
   - `source` with name, URL, license and credit (VOA: public domain, credit "VOA").
   - `segments[]` of sentences with `start`/`end` seconds and `tokens[]` (surface text + `lemma`, optional `phraseId`).
   - `glossary` keyed by lemma, holding the Mongolian meaning, part of speech and, optionally, the English definition.
   - `phrases` for multi-word units that should be selected with one tap.
   - Audio at `public/listening/<slug>.mp3`, moving to Supabase Storage once there are more than a handful of clips.
2. **Alignment pipeline** — `scripts/listening/align.py` runs faster-whisper word timestamps against the audio, matches them to the published VOA text (which is the ground truth) and writes the segment timings. A person then reviews the result.
3. **First content** — two VOA-produced clips, both A2–B1: *George Washington – First President* (2:42) and *Yellowstone: The World's First National Park* (4:00).
4. **Pages**
   - `/listening`: the clip list (level, length, source), replacing the "coming soon" placeholder.
   - `/listening/[slug]`: the player.
5. **Player (mobile first)**
   - Sticky control bar with play/pause, **replay sentence** (large, thumb reach), 0.75x/1x and a transcript show/hide toggle for blind listening.
   - The transcript auto-scrolls to the active sentence, and tapping a sentence seeks to it.
   - Tapping a word pauses the audio and opens a bottom sheet with the word, its lemma, the Mongolian meaning and the English definition. Closing the sheet resumes playback if it was playing.
   - Credit line and source link below the transcript.
6. **Auto time logging**
   - Seconds count only while the audio plays and the tab is visible.
   - The count flushes when the clip ends, when the learner leaves (`pagehide`) or every 5 minutes. A flush is skipped under 60 s, and a clip is capped at 2× its duration.
   - Members: a server action inserts an `activity_events` row with `module: "listening"`, `kind: "listening"` and `meta: { clipId }`.
   - Guests: the event goes to the guest store (imported on onboarding, like manual logs).
   - After a flush, the celebration flow shows as it does for manual logs.
7. **Verify** — typecheck and lint, then screenshots at 390×844 and 1440×900, then a real listen-through to check sync and logging.

## Progress (2026-09-15)

- Done: steps 1–6. The two VOA clips are aligned (295/302 and 363/370 words matched). The glossary covers every word, and phrases like *give up* and *United States* are selected with one tap.
- Verified in the browser at 390×844 as a guest:
  - A word tap opens the sheet and pauses playback.
  - A phrase tap works, and so do playback, 0.75x, jumping to a sentence and replaying it.
  - Leaving after 64 s of listening wrote a guest event (`listening`, 1 min, 10 points).
- Not yet verified: member logging end to end (only the cumulative-points SQL was run, as a read-only query against the database), and a manual listen-through of every sentence's timing.
- Fixed:
  - The manual log sheet now says that listening time on StepUp is logged automatically.
  - "U.S." followed by a sentence starter ("It", "The" …) now ends a sentence, so Yellowstone has 30 sentences.
  - `align.py` lists every word whose timing was interpolated, so those sentences can be checked by ear. All flagged words are mid-sentence (numbers, "U.S.", "six-member"), apart from "slave holder." at the end of Washington sentence 18.

## Phase 2 — saved words and review (2026-09-15)

- Built:
  - The `saved_words` table and migration, with RLS on every operation.
  - "Хадгалах" on the word sheet. Guests get a sign-in link instead.
  - `/vocabulary`, which lists saved words with their box and source clip, lets a learner delete a word and opens the review.
  - `/vocabulary/review`: TTS for the word and its sentence, meaning on reveal, "Санасан / Мартсан", with forgotten cards returning at the end of the session.
  - Review time logs as `vocabulary` / `review`.
  - Timed logging now goes through one path: `logTimedAction` and `logTimed` in the stats provider.
- Verified on local Supabase with a test member at 390×844:
  - Saving *presided*, *give up* (the phrase) and *sword* wrote rows with their lemma and source.
  - 63 s of listening logged `listening` (63 s, 10 points).
  - The review moved the cards to box 1, due in 1 day.
  - The review session logged `vocabulary` (100 s, 10 points) and showed the celebration.
- Fixed during testing:
  - Logging review time revalidated the review page. With the queue empty, the page redirected away from the finish screen. It now always renders the session, and the session keeps its card count from mount.
  - A repeat session inside the 3-hour cumulative window correctly earns 0 points, but it showed a "+0" celebration. Timed logs now celebrate only when points were earned.

## Phase 3 — practice (2026-09-15)

- Built:
  - `/listening/[slug]/practice`, reached from a "Дасгал хийх" card on the player.
  - 10 items per clip: 3 comprehension questions written by hand (`Clip.questions`, with Mongolian explanations), 4 gap-fills and 3 dictations.
  - The gap-fills and dictations are generated in `src/lib/listening/exercises.ts`, seeded by clip and day, so the set is stable all day and changes daily.
- Gap-fill:
  - The blank is a lowercase content word. Names, possessives and helper verbs are never blanked.
  - The 3 distractors share the answer's part of speech and form ("wild" never gets "officials") and prefer the same ending.
  - A wrong answer offers to save the word (members).
- Dictation:
  - Uses short sentences (4–10 tokens, no numbers). They are picked before the gaps because they are scarce.
  - Checking is word-level: exact matches first (LCS), then typos within 1–2 edits count as "close".
  - The result marks each word as ok, close (yellow) or missed (red) and lists extra words.
  - Enter submits, and "Алгасах" shows the sentence.
- Sentence audio uses `useSentenceAudio`, which stops at the sentence end every frame. A listening item autoplays when it appears.
- Timed logging now lives in one hook, `useMeasuredTime`, used by the player, the review and practice. Practice time counts as listening for the clip, so it shares the 3-hour points window.
- Verified:
  - A scratch script checks determinism, a full 10-item set for 60 seeds on both clips, that every gap rebuilds its sentence, that options are unique and share a form, and 7 dictation-checking cases.
  - In the browser at 390×844 as a member:
    - The questions gave correct and wrong feedback with explanations, and the gap audio autoplayed.
    - The wrong gap saved "wild", and dictation marked *unusual* as close and *because* as missed.
    - An exact dictation passed via Enter, and "Алгасах" revealed the sentence.
    - The finish screen showed 3/10, and practice logged `listening` / `yellowstone` (129 s, 10 points) with the celebration.

## Phase 4 — shadowing (2026-09-15)

- Built:
  - `/listening/[slug]/shadowing`, reached from a "Дуудлагаа дадлагажуулах" card on the player. It covers every sentence except the sign-off.
  - Each sentence autoplays. The learner records a take (capped at 2× the sentence + 2 s, 20 s at most), then plays "Эх бичлэг", "Миний бичлэг" and "Ээлжлэн сонсох".
  - Both takes get a silence-trimmed loudness shape (48 bins), their length and a pace hint.
  - Recordings stay in browser memory. Time logs as `speaking` for the clip.
- Flashcards: a card whose source clip still exists plays that sentence from the real recording ("бичлэгээс сонсох") instead of TTS.
- Verified at 390×844 as a member. Headless Chrome has no microphone, so `getUserMedia` was replaced with an oscillator stream:
  - Record showed the stop state and disabled navigation.
  - Stopping decoded the take: "Таны бичлэг · 2.7 сек", 48 bars, "Хурд тань эх бичлэгтэй ойролцоо байна".
  - "Миний бичлэг" played the take.
  - Going through all 23 sentences reached the finish screen and logged `speaking` / `george-washington` (78 s, 10 points).
  - The review card for *presided* played the clip from 12.32 s, the start of its sentence.
- Not verified: a real microphone on iOS Safari or Android Chrome. The mic-permission denial messages were not triggered in a browser either.

## Phase 5 — AI pronunciation scoring (built, off)

- Built:
  - Provider-neutral result types and Mongolian feedback rules. The feedback gives a level, words to retry and up to 3 tips: omissions, θ/ð, w, v, r, l, iː/ɪ, æ, final consonants and fluency.
  - A pure Azure REST adapter (header builder and a parser for both documented response shapes, with SAPI→IPA mapping).
  - `provider.ts`, switched by `AZURE_SPEECH_KEY` + `AZURE_SPEECH_ENDPOINT`. `PRONUNCIATION_PROVIDER=mock` gives labelled sample data, and only outside production.
  - `assessPronunciationAction`, which requires sign-in, takes a 0.3–20 s WAV and uses the catalog text as reference.
  - A result panel that converts the take to 16 kHz WAV in the browser.
- Without a key, the panel shows "AI дуудлагын үнэлгээ · Тун удахгүй". This is what the app shows today.
- Verified by a scratch script (19 checks):
  - The header decodes.
  - Azure's REST and SDK sample responses parse, including SAPI `th` → θ, error types, NoMatch and garbage input.
  - The feedback ordering and limits hold.
  - The mock scores stay in range.
  - The WAV header and the resampling are correct.
  - Trim and envelope work.
- Not verified: a live Azure call, the result panel in a browser (the dev server wasn't restarted with the mock flag) and WAV conversion of a real recording.
- Before launch: the checklist in ADR 0011 (live key test, paid gating with a daily limit, teacher review of the tips, privacy policy).

## Out of scope for phase 1

Saving words, flashcards, dictation, recording, YouTube embeds, a DB table for clips (the JSON files are the catalog until an editor is needed).
