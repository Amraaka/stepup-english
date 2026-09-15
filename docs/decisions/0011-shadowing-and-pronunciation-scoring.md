# 0011 — Shadowing and AI pronunciation scoring

Date: 2026-09-15
Status: Accepted. Shadowing is live. AI scoring is built but switched off until a provider key and paid access exist.

## Context

Phases 4 and 5 of the listening plan (`docs/plans/listening-phase-1.md`)
cover two features. Shadowing lets learners repeat each sentence of a clip
and compare their voice with the original. AI pronunciation scoring gives
word- and sound-level feedback in Mongolian, which the product vision names
as the first paid AI feature. No speech-service key or payment system exists
yet.

## Decision

### Shadowing (phase 4)

- **Page**: `/listening/[slug]/shadowing`, reached from the player. It
  covers every sentence except the reporter's sign-off.
- **Flow**: the sentence plays when it appears. Recording is capped at
  twice the sentence length plus 2 s, with a 20 s maximum. The learner can
  play "Эх бичлэг" and "Миний бичлэг" and use "Ээлжлэн сонсох" to play the
  original, then their own take.
- **Comparison without AI**: both takes are trimmed of silence. The page
  then shows each take's loudness shape (48 RMS bins) and duration, plus a
  pace hint: slower than 1.35× or faster than 0.75× of the original.
- **Privacy**: recordings stay in browser memory. They are never uploaded
  or stored. Phase 5 is the exception, and it sends one take only when the
  learner asks.
- **Tracker**: shadowing time logs as `module: "speaking"` with the clip
  slug as `ref`, under the same cumulative-points rule. A single flush is
  capped at 3600 s.
- **Flashcards**: a saved word whose source clip is still in the catalog
  plays that sentence from the real recording ("бичлэгээс сонсох"). Cards
  without one fall back to TTS.

### AI pronunciation scoring (phase 5)

- **Provider-neutral model**: `src/lib/pronunciation/types.ts` covers the
  overall, accuracy, fluency and completeness scores, plus per-word scores
  with their error type and IPA phonemes. Mongolian feedback comes from
  pure rules in `feedback.ts`:
  - a level
  - words to retry
  - up to 3 tips: omitted words, the θ/ð, w, v, r, l, iː/ɪ and æ sounds,
    word-final consonants and fluency
- **First adapter: Azure AI Speech**, through the REST API for short audio
  (`azure.ts`).
  - The client converts the take to 16 kHz mono WAV.
  - The server sends it with a base64 `Pronunciation-Assessment` header:
    `HundredMark`, `Phoneme`, `Comprehensive`, `EnableMiscue`.
  - The reference text comes from the catalog, never from the client.
  - The parser accepts both documented response shapes: scores on the NBest
    object (REST sample) and scores nested in `PronunciationAssessment`
    (SDK sample). It maps SAPI phonemes to IPA in case IPA isn't honoured.
- **Switch**: `AZURE_SPEECH_KEY` + `AZURE_SPEECH_ENDPOINT`. Without them,
  `pronunciationAvailable()` is false and the panel shows only "Тун удахгүй"
  (honesty rule, ADR 0007).
  - `PRONUNCIATION_PROVIDER=mock` returns labelled sample data, and only
    outside production.
- **Server action** `assessPronunciationAction`:
  - It requires sign-in.
  - It accepts WAV between 0.3 s and 20 s, which stays under the 1 MB
    server-action body limit and Azure's 30 s limit for pronunciation
    assessment.
  - It maps failures to Mongolian messages.

## Before switching AI scoring on in production

1. Create an Azure Speech resource and set the two variables. Then run one
   real request to confirm:
   - the header parameters (`PhonemeAlphabet` is documented for the SDK,
     not the REST table)
   - the response shape the parser expects
2. Gate the action behind paid access, which doesn't exist yet, and add a
   per-user daily limit. Every call costs money.
3. Have an English teacher review the Mongolian sound tips in `feedback.ts`.
4. Update the privacy policy. Speech audio is sent to a third-party
   processor when the learner asks for scoring.

## Rejected alternatives

- **Browser speech recognition (`SpeechRecognition`) for scoring**: it
  returns text, not sound-level scores. Support is uneven, and Firefox has
  none.
- **Uploading and storing every take**: it adds storage cost and privacy
  risk, and shadowing gains nothing from it.
- **Showing placeholder scores in production**: it breaks the honesty rule.

## Consequences

- Shadowing works today with no service cost.
- Turning on AI scoring is a configuration change plus the checklist above.
  No UI or schema work is needed.
- Another provider (e.g. SpeechSuper) only needs a new adapter that returns
  `PronunciationResult`.
