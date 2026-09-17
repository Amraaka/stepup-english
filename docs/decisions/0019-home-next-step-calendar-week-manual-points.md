# 0019 — Home next step, calendar week, manual-log points

Date: 2026-09-17
Status: Accepted. Partly supersedes ADR 0005 (manual-log points) and ADR 0007 (daily quests, nav).

## Context

A review of the home page for a first-time learner found:

- The biggest button was "Цагаа бүртгэх" (log your time). Modules now measure their own time (ADR 0015), so the main action should be studying, and a manual log on top of a measured session counts the same time twice.
- "7 хоногийн сорил" read as a test ("сорил"), and it counted a rolling 7 days, so progress dropped as old days left the window and the "week" never ended. The week strip was also a rolling 7 days under the heading "Энэ 7 хоног".
- Each manual log earned at least 10 points, so four 5-minute logs (60) beat one 20-minute log (30).
- The "Суралцах зам" card and `/learn` still showed a made-up chapter with every skill locked, although four skills and grammar were live.
- Лиг was in the main nav while only a teaser existed.

## Decision

- **Home leads with "Өнөөдрийн алхам"**: the next grammar lesson (from the learner's onboarding level, same rule as `/grammar`, now `nextPathEntry`), plus links to word and mistake reviews due today (`src/lib/next-step.ts`). Beside it, "Өнөөдөр" shows minutes against the daily goal. Manual logging moves there as a secondary button, "Гадуур суралцсан цаг нэмэх", for study done outside StepUp.
- **Weeks are calendar weeks, Monday to Sunday** (`calendarWeek` in `src/lib/game.ts`). The week strip, the weekly goal (100 minutes, now "7 хоногийн зорилго" inside the week card), weekly quests and league points all use it, so they reset every Monday. Days later in the week show as empty outlines.
- **Manual-log points are cumulative per local day**: `manualLogPoints` applies the ADR 0005 rule to the day's total manual minutes and subtracts what earlier manual logs that day earned. Splitting never pays more, and manual logs earn at most 60 points a day. Measured (timed) sessions keep their own rule. A manual log that earns nothing still counts as time and for the streak, and it skips the celebration screen.
- **Daily quests**: "Өнөөдөр цагаа бүртгэ" is removed; any study already completes it through the 20-minute quest.
- **`/learn` is a real hub**: the learner's level, then one card per skill with real progress (lessons finished, texts read, clips listened, shadowing done, saved words) and the next item to open, preferring the learner's level (`src/lib/learn-tracks.ts`). Writing shows as "Тун удахгүй". The made-up chapter and reward nodes are gone.
- **Nav**: Нүүр, Суралцах, Даалгавар, Профайл. `/league` stays reachable from the right-rail and home teasers until leagues are live.

## Consequences

- Points already stored are unchanged (ADR 0005: points are written at insert time).
- Finished reading, listening and shadowing items are recorded since ADR 0020.
- Guest manual logs are the guest events without a `ref`. Imported guest events count as manual for the import day, which can only lower that day's manual points.
