# Tech stack

**Decided 2026-08-25** — see [decisions/0002-tech-stack.md](decisions/0002-tech-stack.md).

| Layer | Choice |
| --- | --- |
| App (front + back) | Next.js — App Router, TypeScript, Tailwind |
| Database | Postgres via Supabase |
| Auth | Supabase Auth |
| File storage | Supabase Storage (books, audio); Cloudflare R2 if it outgrows free tier |
| ORM | Drizzle |
| Hosting | Vercel (free tier) |
| Payments | QPay / SocialPay via API routes (later) |
| AI | Vercel AI SDK via server routes (later) |

Principle: one codebase, no separate backend service until real-time games or heavy background jobs demand it.
