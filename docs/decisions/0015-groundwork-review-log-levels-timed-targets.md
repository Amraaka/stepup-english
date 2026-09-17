# 0015 — Groundwork for skill modules: review log, level mapping, timed-target registry

Date: 2026-09-16
Status: Accepted. Step 0 of `docs/plans/skill-modules-integration.md` (P4, P7, P8).

## Context

The integration plan found that reading, writing, word lists and speaking drills can't plug in until a few shared pieces exist. Three of them are small and have no user-facing risk, so they go first:

- Time logging accepted only hard-coded modules in an `if` chain.
- `profiles.english_level` (beginner … advanced, unsure) was saved at onboarding and never read, while content uses CEFR bands A1–C1 in two separate types.
- Word and grammar reviews updated rows in place, so there was no history for hard-word lists or for fitting FSRS later.

## Decision

### Review log
- New append-only table `review_log` (`20260916010000_review_log.sql`): `item` (`word` | `grammar`), `item_ref`, `correct`, `box_before`, `box_after`, `reviewed_at`. RLS: read and insert own rows; no update or delete (cascade on account deletion).
- `item_ref` is the **lemma** for words, not the saved row id, so history survives deleting and re-saving a word. Grammar uses `<slug>|<item_key>`, the same key `grammar_review` uses.
- `reviewWord` and `reviewGrammarItem` write the log row in the same transaction as the box update.
- Practice results that only *queue* a mistake (`recordPractice`) are not reviews and are not logged.

### Level mapping
- `src/lib/levels.ts` holds `CefrLevel` and `CEFR_LEVELS`; `GrammarLevel` and `ClipLevel` are aliases of it.
- `cefrFor(englishLevel)`: beginner → A1, elementary → A2, intermediate → B1, advanced → B2, **unsure → null**. The plan suggested A2 for unsure; null was chosen so each module decides its own safe default (the grammar path starts at A1) until the placement test exists.
- First use: the grammar path's "Дараагийнх" marker is the first unfinished lesson at or above the learner's level, falling back to the first unfinished lesson overall. Lessons below the level stay open.

### Timed-target registry
- `logTimedAction` looks up `TIMED_CAPS[module](ref)`, which returns the cap in seconds or null. The mapped type requires one entry per `TimedTarget` module, so adding a module without a rule fails typecheck.
- The target comes from the client, so the module is checked with `Object.hasOwn` and the ref must be a string. Caps and accepted refs are unchanged from before.

### Timed logs survive a page unload (amended 2026-09-16)
- **Bug found by testing:** members' pending time (up to `flushEverySec`, 300 s) was sent only through the `logTimedAction` server action, including on tab hide. A request started while the page unloads can be cancelled, so a refresh, a closed tab or typing a new address lost it. Local test: a reader that had counted about 66 s, then a hard reload, logged nothing; the same kind of session left through the in-app "Унших" link logged 83 s.
- **Fix:** the caps and checks move to `recordTimed` in `src/lib/timed.ts`, used by both the server action and a new route, `POST /api/track/timed`. It needs a signed-in user, rejects a cross-site `Origin`, and applies the same caps and cumulative-points rule, so it adds no new way to earn points.
- `useMeasuredTime` sends pending time with `beaconTimed` on `visibilitychange` → hidden and on `pagehide`. `navigator.sendBeacon` is used, falling back to `fetch(…, { keepalive: true })`. In-app unmounts, the periodic flush and a finished session still use the server action, which returns fresh stats and can show the celebration. Guests are unchanged: their time is written to `localStorage` at once.
- Trade-off: time flushed on tab switch doesn't refresh the rail's stats until the next server round trip.

## Consequences

- FSRS (study V7) and hard words (V5) can use real history from now on; the log grows by one row per review answer (at most ~40 a day per learner with today's caps).
- Future count-style stats (words known, texts read) must not be written as `activity_events`: `buildStats` treats any day with an event as active and would inflate streaks. See the integration plan, P4.
