# 0003 — Audience and MVP direction

Date: 2026-08-25
Status: accepted

## Context

Early docs framed StepUp English as a platform for kids. A founder interview clarified the actual vision: an all-in-one platform for anyone learning English, with progress tracking as the core.

## Decision

- **Audience**: Mongolian teens and adults, all levels; a placement test routes users to leveled content.
- **MVP core**: the progress tracker hub, starting with study streaks & time. Skill modules plug into it later.
- **Platform**: mobile-first responsive web (PWA) on the existing Next.js stack; no native app for now.
- **First AI paid feature**: AI writing feedback with Mongolian explanations.
- **Monetization**: free initially; freemium with an AI subscription tier later.
- **Immediate phase**: 2–4 weeks of competitor research (Duolingo, Anki/Quizlet, ELSA/Speak, LingQ/Readlang) before building.

## Consequences

- README and docs no longer describe a kids' product.
- Schema and feature work should start from the tracker (users, study sessions, streaks, goals), not from lesson content.
- Speaking/pronunciation (audio ML) is deferred — text-based AI features come first.
