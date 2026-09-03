# 0005 — Activity log, points, and streaks

Date: 2026-09-03
Status: accepted

## Context

ADR 0003 sets a tracker-first MVP: a progress hub (streaks and study time
first) that future skill modules plug into. The foundation that everything
derives from must be chosen before auth/UI work.

## Decision

### One append-only event log is the core

`public.activity_events` is the single source of truth for all learner
activity. Every current and future module (grammar, vocabulary, listening, …)
records activity only by inserting events. Points, streaks, study time, and
charts are all derived from this table — there are no separate counters to
keep in sync.

- Append-only: RLS allows users to `select` and `insert` their own rows;
  there are no update/delete policies.
- `module` is a checked text column (not a Postgres enum) so adding a module
  is a cheap check-constraint change.
- `meta jsonb` carries module-specific detail without schema churn.

### Points are stored on the event, not recomputed

`points` is written at insert time by the server action that creates the
event. Rules may change later without rewriting history.

MVP rule (manual study log): `points = min(10 + 5 * floor(minutes / 5), 60)`
— logging anything earns 10; every full 5 minutes earns 5 more; one session
caps at 60. Per-event hard cap in the DB: 0–1000.

### Streak rules

- A day is **active** if it has ≥ 1 event in the user's timezone
  (`profiles.timezone`, default `Asia/Ulaanbaatar`). Stored `occurred_at` is
  always UTC (`timestamptz`); day bucketing happens at read time.
- Current streak = consecutive active days counting back from **today, or
  from yesterday** if today has no events yet (an unfinished today never
  breaks the streak).
- Streaks are computed from the log at read time (one indexed query per
  dashboard load). Caching in a column/matview is a later optimization, not
  part of the model.

### Access model

- Supabase Auth (email/password to start) with a `profiles` row auto-created
  by trigger.
- Server actions use the user id from `supabase.auth.getUser()` only. The
  Drizzle/postgres connection bypasses RLS (it is the server), so every query
  must filter by that id; RLS remains as defense in depth for the Data API.

## Rejected alternatives

- **Stored streak/points counters updated on write** — two sources of truth,
  timezone bugs baked in at write time, and harder to change rules.
- **Postgres enum for `module`** — enum changes are DDL with locking caveats;
  a check constraint is enough at this scale.
- **Deriving points from rules at read time** — rule changes would silently
  rewrite users' historical totals.
- **≥ X minutes to count as an active day** — friction where the product
  philosophy ("small by small") wants the lowest possible bar.

## Consequences

- Every future module API is "insert an event" — no tracker changes needed.
- Timezone lives on the profile; changing it re-buckets history at read time
  (accepted — favors correctness for travelers over frozen history).
- The dashboard query reads distinct active days; fine under the
  `(user_id, occurred_at desc)` index for years of daily use.
