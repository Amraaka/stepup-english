# Product vision

_Last updated: 2026-08-25, from a founder interview._

## What StepUp English is

An all-in-one English learning platform where people track their progress, practice every skill, and access a large library of resources in a single user-friendly place — with AI assistance built into each module to improve the learning experience.

**Not** a kids' product (early docs said kids — superseded). Primary audience: **Mongolian teens and adults** learning English for themselves, school, work, or exams.

## Core beliefs

- Resources are scattered across many apps and sites; nothing shows learners their overall progress. Aggregation + tracking is the wedge.
- All levels are welcome: a **placement test** routes users to leveled content (A1–C1).
- **Mobile-first web (PWA)**: one Next.js codebase, designed for phones, installable.

## Module map (full ambition, built one at a time)

| Module | Notes |
| --- | --- |
| **Progress tracker** | The spine. Everything else feeds into it. |
| Grammar | Includes the 30-day Grammar challenge |
| Word memorization | Spaced repetition (Anki/Quizlet-inspired) |
| Listening / Reading | Real content with instant lookup (LingQ/Readlang-inspired) |
| Writing | AI feedback — first paid AI feature |
| Speaking | AI pronunciation/conversation practice (ELSA/Speak-inspired), later |
| Book archive | Public domain + curated open sources |
| Interactive games | Gamification layer (Duolingo-inspired) |
| Competitions | e.g. 500 words in a week → exam → award |

## MVP direction

1. **Progress tracker hub first**, and within it, **study streaks & time** shipped first and done really well (daily check-ins, study minutes, streak calendar). Goals/plans, skill self-assessment, and activity logging come after.
2. First AI feature (paid-tier seed): **AI writing feedback** with explanations in Mongolian.
3. Modules plug into the tracker one by one; likely next: 30-day Grammar challenge or word memorization.

## Content strategy

Mix of: curated public-domain/open sources (Project Gutenberg, VOA, etc.), AI-generated exercises with founder review, and original content created over time.

## Monetization

Free while finding users. Long-term: freemium — core modules free, AI features (writing feedback, speaking practice, coach) behind a monthly subscription.

## Current phase (as of 2026-08-25)

**Research, 2–4 weeks**: deep competitor teardown of Duolingo, Anki/Quizlet, ELSA/Speak, and LingQ/Readlang — document what to borrow, then define the MVP spec and start building. Research notes live in the Obsidian vault (`english-platform/`).
