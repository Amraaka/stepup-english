# 0002 — Tech stack: Next.js + Supabase + Vercel

Date: 2026-08-25
Status: decided

## Decision

- **App**: Next.js (App Router, TypeScript, Tailwind) — frontend and backend in one codebase; no separate backend service
- **Database/Auth/Storage**: Supabase (Postgres, auth, file storage for book archive and audio)
- **ORM**: Drizzle
- **Hosting**: Vercel free tier to start; avoid Vercel-only APIs so a later move to a VPS stays cheap
- **Payments (later)**: QPay/SocialPay via API routes
- **AI features (later)**: Vercel AI SDK via server routes

## Why

Solo developer with existing Next.js + Postgres experience. A separate backend doubles the work for zero benefit at this scale; Next.js server actions/API routes cover it. Supabase replaces hand-built auth and storage. All free tiers until real users exist.

## Revisit when

Heavy real-time multiplayer games or large background-job pipelines are needed — then add one small service beside the app, don't rewrite.
