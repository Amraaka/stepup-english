# 0007 — Gamified app shell, derived game layer

Date: 2026-09-14
Status: Accepted — supersedes the navigation part of ADR 0006. Daily quests and the Лиг nav item changed in ADR 0019.

## Context

The owner wants StepUp to feel like an interactive, gamified app rather than
a website. A design canvas (`docs/design/gamified-template/`) was approved,
informed by `docs/research/gamified-learning-ui.md`. Only the tracker
(study-time logs, points, streaks) exists; lessons, placement, leagues and
friends do not.

## Decision

- **Shell** (`src/components/shell/`): desktop = left sidebar + center column
  + right rail (≥1280px: streak, daily quests, league teaser); phones = top
  stat bar + bottom tabs. Nav: Нүүр `/`, Суралцах `/learn`, Даалгавар
  `/quests`, Лиг `/league`, Профайл `/profile`. Skill pages stay at
  `/listening` etc., reached from the sidebar, path and skill cards.
- **One stats source** (`StatsProvider`): members get DB stats from the
  layout; guests get stats from localStorage. Logging goes through one
  bottom sheet and ends in a celebration screen (big streak moment on the
  first log of the day, points toast otherwise).
- **Palette**: coral stays the brand; sky/mint/sun/violet map to
  listening/reading/writing/speaking. Tokens in `globals.css`, class maps
  in `src/lib/tones.ts`.
- **Game layer is derived, never stored** (`src/lib/game.ts`):
  - Daily goal 20 minutes (separate from the streak — any log keeps it).
  - Level thresholds `50·L·(L−1)` points (0, 100, 300, 600, 1000, …).
  - Daily quests: 20 min, check in, 50 points. Weekly: 100 min, 5 active days.
  - Achievements from longest streak / total minutes / total points.
- **Honesty rule**: features without a backend (lessons, placement test,
  league, monthly challenge) render as "Тун удахгүй". No fake leaderboard
  names or claimable rewards in the app.

## Consequences

- Changing quest or level rules re-computes history (acceptable: nothing is
  awarded or stored yet). If rewards become claimable, claims must be
  stored as activity events (ADR 0005).
- No streak freeze yet — research recommends one; it needs stored state.
- Leagues need opt-in, grouping and weekly reset jobs before going live.

## Update 2026-09-14

- Vocabulary (`/vocabulary`, teal) and grammar (`/grammar`, rose) joined the
  skill list. The four core skills keep compact spots (home path preview);
  all six appear in the sidebar, skill grid, learning path and profile.
- The desktop sidebar collapses to a 76px icon rail with hover/focus labels.
  The choice lives in the `stepup.sidebar` cookie so the server renders the
  same width on the next visit (no layout jump).
