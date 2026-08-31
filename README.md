# StepUp English

An all-in-one English learning platform for Mongolian learners — track your progress, practice every skill, and find a massive library of resources in one place. Step by step.

## Vision

Learners lose momentum because resources are scattered: one app for vocabulary, another site for grammar, videos somewhere else — and none of them show you your overall progress. StepUp English brings everything into one user-friendly, mobile-first place, with a progress tracker as the spine and AI assistance woven into each module.

Primary audience: Mongolian teens and adults, all levels (placement test routes users to leveled content). See [docs/product-vision.md](docs/product-vision.md).

## Planned features

- Progress tracking (the MVP spine): streaks, study time, goals, skill levels
- Listening, Reading, Writing, Speaking, Grammar modules
- Word memorization (spaced repetition)
- Book archive & curated open resources
- Interactive games
- 30-day challenges (Grammar first)
- AI paid features (first: AI writing feedback with Mongolian explanations)
- Open competitions (e.g. 500 words in a week → exam → award)

## Stack

Next.js (App Router, TypeScript, Tailwind) · Supabase (Postgres, auth, storage) · Drizzle · Vercel — see [docs/tech-stack.md](docs/tech-stack.md).

## Development

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys
npm run dev                  # http://localhost:3000
```

## Docs

Decisions live in [docs/decisions/](docs/decisions/) (ADR style). Planning and research live in a local Obsidian vault.
