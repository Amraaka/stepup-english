# StepUp English

An English learning platform for kids — everything gathered in one place, so kids actually learn. Step by step.

## Vision

Kids lose momentum because resources are scattered: one app for vocabulary, another site for grammar, videos somewhere else. StepUp English brings it all into a single path a child can follow, phase by phase.

## Planned features

- Listening, Reading, Writing, Speaking, Grammar
- Word memorization
- Book archive
- Interactive games
- Progress tracking
- AI-powered paid features
- Open competitions (e.g. 500 words in a week → exam → award)
- 30-day challenges (Grammar, and more)

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
