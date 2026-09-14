# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mongolian teens and adults learning English for themselves, school, work, or exams — all levels (A1–C1), routed by a placement test. Mostly on phones, in short daily sessions. Not a kids' product.

## Product Purpose

StepUp English is one place where a Mongolian learner practices every English skill (listening, reading, writing, speaking, plus vocabulary and grammar) and sees overall progress. Philosophy: small by small, step by step. Success = learners come back daily and can see themselves climbing.

## Positioning

Resources are scattered across many apps; nothing shows a learner's whole progress. StepUp aggregates practice across all skills into one progress spine (streaks, study time, points), with explanations in Mongolian — including AI writing feedback in Mongolian as the first paid feature.

## Operating Context

- Mobile-first web / PWA; desktop must still look intentional.
- Daily ritual: open app → see streak and today's goal → do a short session → log/earn points.
- The owner wants the product to feel like an interactive, gamified app, not an ordinary website (references: Duolingo path/quests/leagues, bento study dashboards).

## Capabilities and Constraints

- Built today: auth (Supabase), append-only activity log, points per session (`min(10 + 5·floor(min/5), 60)`), streaks in user timezone, 7-day chart, guest mode in localStorage, manual study-time logging. See ADR 0005.
- Not built yet: skill module content, placement test, XP levels, quests, leagues, friends, achievements. Designs may show these as planned; they must not be presented as live.
- Nav structure: Home + four skills (ADR 0006).
- Stack: Next.js App Router, Tailwind v4, Supabase, Drizzle, Vercel (portable).

## Brand Commitments

- Name: StepUp English. Mark: ascending arc (`public/logo.svg`) — meaning rising motion.
- Personality: serious, energetic, trustworthy; international look; Mongolian shows up in language, not visual clichés.
- Coral is the lead brand color with charcoal; the owner approved expanding the palette with a few supporting colors for gamification (2026-09-14, supersedes "coral only" in ADR 0004 for UI).
- A mascot character is wanted (2026-09-14); final character art to be produced later.
- Font: Manrope (Latin + Cyrillic).
- User-facing copy in Mongolian (Cyrillic) with English where it teaches.

## Evidence on Hand

No real users, testimonials, league data, or content yet. Any leaderboard names, stats, or lessons in designs are synthetic and must be labeled or replaced.

## Product Principles

1. The tracker is the spine — every module feeds one streak/points system.
2. Lowest possible bar for a "day done"; reward consistency over intensity.
3. Game mechanics motivate adults without shame: no guilt-tripping streak loss.
4. Explain in Mongolian; teach in English.
5. Ship one module at a time; empty areas show what's coming honestly.
