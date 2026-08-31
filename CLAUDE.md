# StepUp English — context for Claude

All-in-one English learning platform for Mongolian teens and adults (all levels, placement-routed), built solo by Battsengel. Philosophy: small by small, step by step.

Core: a progress tracker hub (streaks & study time first) that skill modules (grammar, vocabulary, listening, reading, writing, speaking, books, games, challenges) plug into over time. Mobile-first web/PWA. Free at first; later freemium with paid AI features (first: AI writing feedback with Mongolian explanations). Currently in a 2–4 week competitor-research phase (Duolingo, Anki/Quizlet, ELSA/Speak, LingQ/Readlang). See `docs/product-vision.md` and ADR 0003.

## Where things live

- **This repo** — Next.js app (App Router, TypeScript, Tailwind, src dir) and docs/decisions
- **Obsidian vault** — `/Users/amara/Documents/Obsidian Vault/english-platform/` — vision, research, curriculum, planning. Numbered folders (00-Inbox … 90-Archive), decisions in `20-Decisions`
- Mirror any code-relevant decision into `docs/decisions/` here (numbered ADR style)

## Stack

Next.js + Supabase (Postgres/auth/storage) + Drizzle + Vercel. No separate backend service — server actions and API routes only. See `docs/tech-stack.md` and ADR 0002.

## Conventions

- Docs in English; user-facing content will be Mongolian + English
- Decisions: short ADRs in `docs/decisions/NNNN-title.md`
- Avoid Vercel-only APIs so hosting stays portable
- Secrets in `.env.local` (never committed); template in `.env.example`
- Verifying UI changes: screenshot at a phone viewport first (390×844), then desktop (1440×900). Mobile is the primary target; desktop must still look intentional
