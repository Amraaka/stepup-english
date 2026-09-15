# 0009 — Listening module: content sources and player

Date: 2026-09-15
Status: Accepted (content and player strategy). Legal questions below remain open.

## Context

The Listening module (`/listening`, currently "Тун удахгүй") should let a
learner watch a clip with an interactive transcript and tap a word to see its
meaning. Saved words become flashcards, and the learner can replay
sentences, slow the clip down, do dictation, shadow the speaker and later
get AI pronunciation feedback. Watch time should log to the tracker
automatically (ADR 0005).

The first idea was "embed any YouTube video with its subtitles". Research
(`docs/research/listening-content-sourcing.md`) shows that most of the
planned features cannot legally run on third-party YouTube videos:

- Captions for videos we don't own can't be fetched through the API, and
  scraping them is banned.
- Downloading audio or video from YouTube is banned. That rules out Whisper
  transcription, clips cut for flashcards and offline use.
- The player must not be hidden, covered, shown below 200×200 or played in
  the background. That rules out "blind listening" on YouTube.
- Charging to watch an embedded video, or blocking and skipping its ads, is
  banned.
- TED (CC BY-NC-ND) and the BBC do not allow commercial use or clipping
  without a license.

## Decision

### Two content types behind one player interface

`ListeningSource` has two backends:

| Capability | **Hosted** (licensed media we store) | **YouTube embed** |
|---|---|---|
| Interactive transcript below the player | ✅ | ✅ only if the transcript is ours and licensed (see below) |
| Tap word → meaning, save word | ✅ | ✅ |
| Replay sentence (`seekTo`), 0.75x speed, pause on word tap | ✅ | ✅ through the documented IFrame API, with controls *outside* the player |
| Blind listening (video hidden) | ✅ | ❌ collapse *our transcript* instead |
| Clip audio on flashcards | ✅ | ❌ sentence text + TTS only |
| Dictation / gap-fill | ✅ | ✅ (text from our transcript) |
| Shadowing with the original audio | ✅ | ⚠️ replay through the player only, no audio extraction |
| AI alignment / transcription | ✅ | ❌ |
| Paid tier | allowed | ❌ lessons with an embed stay free |

The UI reads `source.capabilities` and hides what a backend can't do. It
never offers a feature and then fails.

### Content for the first ~30 clips (one level band: A2–B1)

1. **VOA Learning English, about 15 clips** (public domain). Only material
   VOA produced itself; skip anything with AP, Reuters or Getty footage.
   Credit "VOA" and don't imply VOA endorses us. Download copies early,
   because the archive's future is uncertain.
2. **NASA, about 5 clips** (not under US copyright). No logos, no marked
   third-party material, no implied endorsement.
3. **CC BY YouTube videos, about 5**, embed only, with attribution (title,
   author, link, license). Only from channels that clearly own their
   content.
4. **LibriVox / Tatoeba / Common Voice, about 5**, for read-alongs and
   dictation. Filter Tatoeba audio to licenses that allow commercial use.
5. In parallel, email 3–5 English-teacher YouTubers asking for written
   permission (transcripts, translations, clips, freemium use) and their
   source files. Permitted videos then move to the hosted backend.

Not used: TED, BBC Learning English, scraped YouTube captions, the YouGlish
widget. All of them need a license or permission first.

### Transcripts and word data

- Transcripts exist only for content that is public domain, CC BY, CC0 or
  permission-granted. Hosted media may be aligned with AI (e.g. Whisper), and
  a person checks every transcript before it is published.
- When a clip is added, its words are **lemmatized** and given a base
  Mongolian meaning ahead of time. Its phrases (e.g. *give up*, *by the way*)
  are tagged so one tap selects the whole phrase. Taps show this data
  instantly. AI runs only when the learner presses "explain in this
  sentence".
- A saved word stores its lemma, the sentence and the clip id plus
  timestamp. The card must still work with only the text + TTS if the clip
  disappears.

### YouTube compliance checklist (for embed sources)

- Player ≥ 200×200, full-width 16:9 on phones, `playsinline=1`,
  privacy-enhanced domain, correct `Referer`.
- Nothing drawn on top of the player. Our controls and transcript sit below
  it.
- Play starts with the user. No autoplay unless more than half the player
  is visible.
- Ads are never touched.
- The site has a published privacy policy that users accept, plus links to
  the YouTube ToS and Google Privacy Policy.
- A periodic health check marks clips whose video was removed or had
  embedding disabled as unavailable.

### Tracker integration

- The listening module inserts `activity_events` with `module:
  "listening"` and `meta: { sourceId, backend }`.
- Time counts only while the player is playing **and** the tab is visible,
  with a per-clip cap. Points for automatic logs follow ADR 0005's formula,
  applied per session.
- The manual log sheet shows time that was already logged automatically, so
  learners don't count the same minutes twice.
- Saving words and flashcards requires an account. Guests can watch and
  tap words, but guest saves are not imported.

## Rejected alternatives

- **Any YouTube video + YouTube captions**: captions can't be fetched, and
  scraping breaks the Developer Policies.
- **Downloading YouTube audio for Whisper or clips**: banned by the ToS and
  Developer Policies (III.E.1.a, III.I.7).
- **Hiding the player for blind listening**: bans on background players and
  on separating audio (III.I.7–9).
- **TED as the core library**: NC/ND license; for-profit courses need a TED
  license.
- **Flashcards that embed a YouTube player per card**: slow on phones,
  interrupted by ads, and break when the video disappears.
- **Word-and-sentence AI glosses generated on every tap**: they almost never
  hit the cache, so every tap would cost money and add waiting time.

## Consequences

- Hosted media needs storage and a transcript pipeline (Supabase Storage;
  AI alignment plus human review). This is the main build cost of phase 1.
- The library starts small and at one level band. "Clip of the day" and a
  YouGlish-style word search wait until the library is large enough.
- Any paid Listening features must be our own AI features (e.g.
  pronunciation scoring) running on hosted content or the learner's
  recordings. They must never gate an embedded video.
- Build order: (1) hosted player + transcript + word taps + auto time
  logging, (2) saved words and SRS flashcards with text/TTS, (3) dictation
  and gap-fill, (4) shadowing, with clip audio on cards for hosted content,
  (5) paid AI pronunciation scoring.

## Open questions

- **Lawyer:** is a hand-typed transcript or translation of a copyrighted
  video allowed under Mongolian law, and do educational exceptions apply to
  a freemium company?
- Does a free sign-in wall in front of lessons with embeds count as
  "gating" under Developer Policy III.F.3.b?
- Is an automatic sentence loop allowed scripted control, or "modifying
  playback"?
- BBC Learning English's own terms and Common Voice's speaker-identification
  clause were not read. Verify both before relying on them.
