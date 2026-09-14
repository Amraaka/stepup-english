# 0008 — Google login and first-run onboarding

Date: 2026-09-14
Status: Accepted

## Context

Signup was email/password only, went straight to the home page, and knew
nothing about the learner. Guest-mode study logs (localStorage) were lost on
signup. Local auth redirect URLs did not allow `http://localhost:3000`.

## Decision

- **Google login** via Supabase OAuth (PKCE): `signInWithGoogle` server
  action → Google → `src/app/auth/callback/route.ts` exchanges the code for a
  session. The same callback handles email-confirmation links
  (`emailRedirectTo`).
- **Email confirmation aware**: when `signUp` returns no session (hosted
  projects with confirmations on), the form shows "check your email" instead
  of redirecting into a logged-out app.
- **Onboarding** (`/onboarding`), required once per account: English level
  (self-assessed, until a placement test exists) and learning goals
  (multi-select). Name is asked only if missing. The `(site)` layout
  redirects signed-in users with `profiles.onboarded_at is null`.
- **Schema** (`20260914041620_profile_onboarding.sql`): `english_level`,
  `learning_goals text[]`, `onboarded_at`, all check-constrained. The
  signup trigger now also reads Google's `full_name` / `name`, and its
  function is no longer executable by `anon` / `authenticated`.
- **Guest history import**: onboarding offers to move this device's guest
  logs into the account. The server re-validates every event (date format,
  1–240 min, ≤ 400 days old, not in the future, max 500) and recomputes
  points, tagging rows `meta.source = "guest-import"`.

## Consequences

- Google stays disabled until a Google Cloud OAuth client is created and
  configured (local: `supabase/config.toml` + `supabase/.env`; hosted:
  dashboard). The button shows a friendly error meanwhile.
- Existing accounts see onboarding once on their next visit.
- Level and goals are stored but not yet used to route content.
