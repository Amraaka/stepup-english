# Speaking with OpenAI speech (STT, TTS, Realtime)

Status: idea / plan, not decided. Write ADR 0021 ("Speech provider (OpenAI) and AI credits") when work starts.
Date: 2026-09-17
Mockups: https://claude.ai/artifact/5DB7x3KctbaqqqaxDhdbTX
Vault: `50-Product/Ярих модулийн санаа (OpenAI STT, TTS).md`

## Key constraint

OpenAI transcription returns text, not pronunciation scores, and its language model can "correct" a mispronounced word into the likely one. Sound-level scoring stays with Azure (ADR 0011, built, switched off). OpenAI STT is used for intelligibility checks and for free-speech content (grammar, word choice, pace, fillers).

## Prices checked 2026-09-17 (developers.openai.com/api/docs/pricing)

- `gpt-4o-mini-transcribe` $0.003/min, `gpt-4o-transcribe` $0.006/min
- `tts-1` $15 per 1M characters; `gpt-4o-mini-tts` accepts style instructions
- `gpt-realtime-mini` audio in $10 / out $20 per 1M tokens. Cost grows with conversation history; measure with real sessions before pricing.

## Features

| # | Feature | OpenAI | Rough cost | Tier |
|---|---|---|---|---|
| 1 | "Were you understood?" check: STT, then diff against the reference sentence; mismatches link to `feedback.ts` sound tips. Do not pass the reference as the STT prompt | mini-transcribe | 5 s ≈ $0.00025 | Free, daily cap |
| 2 | Multi-voice phrase drills (S2): 3–4 voices × 2 speeds, pre-generated | TTS, offline | < $1 per 1000 phrases, once | Free |
| 3 | Daily 1-minute speaking journal: transcript, top 3 fixes and 2 better words (structured output), Mongolian notes, save new words. Metrics from text only: wpm, unique words, fillers | STT + text model | ≈ $0.005–0.01 | Pro (free: 1/week) |
| 4 | IELTS-style answers (Part 1–3): approximate criteria, labelled "not an official score"; model answer via TTS. Pronunciation only if Azure is on | STT + text + TTS | ≈ $0.01–0.02 | Pro |
| 5 | AI roleplay in Mongolian settings (directions for a tourist in UB, job interview abroad, shop, clinic); "help in Mongolian" button; report after the call via feature 3's pipeline | realtime-mini, WebRTC | 5 min ≈ $0.15–0.40 (estimate) | Pro, minute cap |

## Architecture

No separate backend (ADR 0002). Same provider pattern as `src/lib/pronunciation`.

- Browser: `use-recorder.ts` → 16 kHz WAV → POST. Realtime connects from the browser over WebRTC with an ephemeral key; the API key never leaves the server.
- Routes: `/api/speech/transcribe` (auth → credit → STT), `/api/speech/feedback` (text → structured JSON), `/api/realtime/session` (instructions + CEFR level → ephemeral key).
- `src/lib/ai/`: `speech/provider.ts` (`transcribe`, `synthesize`), `speech/openai.ts`, `speech/mock.ts` (dev only), `credits.ts` (`useAiCredit(user, kind, units)`), `compare.ts` (reference ↔ transcript diff, no AI).
- Script: `scripts/speaking/build_audio.ts` generates phrase audio once and uploads `tts/<hash(text+voice+speed)>.mp3` to Supabase Storage. Share the TTS code with the Reel pipeline.
- Data: `ai_usage` (user, kind, units, day), `speaking_entries` (transcript, fixes, metrics; no audio), `activity_events` with `module: "speaking"`.

## Order

1. Groundwork (P6): `OPENAI_API_KEY` in `.env.local` / `.env.example`, `ai_usage`, plan field, provider + mock, privacy policy (speech sent to OpenAI on request), AI-voice disclosure.
2. Cheap: features 2 and 1, plus a "say it" mode on word cards.
3. Pro, async: features 3 and 4; share the text pipeline with writing feedback; switch Azure on (ADR 0011 checklist).
4. Pro, live: feature 5 with three scenarios and a 5-minute cap; measure cost over ~20 sessions.

## Open questions

- Terms for sending under-18 users' speech to OpenAI (parental consent?); ask age at onboarding?
- Mongolian TTS quality is unverified; keep Mongolian explanations as text first.
- Free-tier cap for feature 1.
