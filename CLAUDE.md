# StepUp English — context for Claude

All-in-one English learning platform for Mongolian teens and adults (all levels, placement-routed), built solo by Battsengel. Philosophy: small by small, step by step.

Core: a progress tracker hub (streaks & study time first) that skill modules (grammar, vocabulary, listening, reading, writing, speaking, books, games, challenges) plug into over time. Mobile-first web/PWA. Free at first; later freemium with paid AI features (first: AI writing feedback with Mongolian explanations). Currently in a 2–4 week competitor-research phase (Duolingo, Anki/Quizlet, ELSA/Speak, LingQ/Readlang). See `docs/product-vision.md` and ADR 0003.

## Where things live

- **This repo** — Next.js app (App Router, TypeScript, Tailwind, src dir) and docs/decisions
- **Obsidian vault** — `/Users/amara/Documents/Obsidian Vault/english-platform/` — vision, research, curriculum, planning. Numbered folders (00-Inbox … 90-Archive), decisions in `20-Decisions`
- Mirror any code-relevant decision into `docs/decisions/` here (numbered ADR style)

## Obsidian vault is the project brain

The vault holds the live state of the project; keep it current as part of the work.

- **Session start**: read `50-Product/Progress - StepUp English.md` (module status, open issues) and the latest note in `10-Daily/` before planning.
- **When work lands**, the task is done only once the vault matches the repo:
  1. Progress hub: status table, milestones, open issues (tick what closed, add what opened)
  2. `10-Daily/YYYY-MM-DD.md` (template `60-Reference/Templates/Template - Daily.md`): worked on, learned, next
  3. Every new ADR mirrored into `20-Decisions/` as `YYYY-MM-DD - Title.md`, linked from the hub
  4. Code changed → refresh the Graphify code graph in `70-Code-Graph/` (commands in `docs/graphify.md`). That folder is export-owned; write notes elsewhere
- Vault notes are written in Mongolian, linked with `[[wikilinks]]`, each ending with a `## Related` list.

## Stack

Next.js + Supabase (Postgres/auth/storage) + Drizzle + Vercel. No separate backend service — server actions and API routes only. See `docs/tech-stack.md` and ADR 0002.

## Conventions

- Docs in English; user-facing content will be Mongolian + English
- Decisions: short ADRs in `docs/decisions/NNNN-title.md`
- Avoid Vercel-only APIs so hosting stays portable
- Secrets in `.env.local` (never committed); template in `.env.example`
- Verifying UI changes: screenshot at a phone viewport first (390×844), then desktop (1440×900). Mobile is the primary target; desktop must still look intentional
