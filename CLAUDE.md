# StepUp English — context for Claude

English learning platform for Mongolian kids, built solo by Battsengel. Philosophy: small by small, step by step.

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
