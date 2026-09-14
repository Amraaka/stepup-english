# Gamified learning-app UI/UX — research notes

Date: 2026-09-14
Scope: patterns for making StepUp feel like an interactive, gamified app (mobile-first PWA, Mongolian teens + adults, A1–C1), given today's tracker-first MVP (study-time log, points, streaks — ADR 0005).

## 1. Mechanics that actually drive retention (with evidence)

| Mechanic | Evidence |
|---|---|
| **Streak, with a low bar** | Splitting "daily goal" from "streak" (one lesson extends the streak) → D14 retention +3.3%, learners on a streak +10.5% (+19% for new learners); a year later 7+ day streaks +40%. Duolingo: "lowering the barriers to building a consistent daily habit is more important … than how much you learn each day, at least early on." [1] |
| **Streak milestones / celebration** | Learners reaching a 7-day streak are 3.6× more likely to finish their course; a new streak-extension animation lifted D7 retention +1.7% for new learners. [2] |
| **Slack (Streak Freeze)** | Letting learners equip 2 freezes → DAU +0.38%. Research shows "slack" motivates more than rigid rules. [2] Academic work: intact streaks raise engagement; broken ones drive abandonment, *less so when the streak can be "repaired"*. [3] |
| **Weekly leagues** | Leaderboards: learning time +17%, highly engaged learners (1h/day, 5 days/wk) tripled; streak/notification/league work together raised CURR (retention of best users) 21% and cut their daily churn 40%+. [4] Matched by similar study habits + timezone; weekly reset; opt-out via private profile. [5] |
| **Guided path** | The 2022 path redesign (sequential nodes, units, built-in review) produced better reading/listening outcomes than the old skill tree. [6] |
| **Achievements / personal records** | Trophy shelf on profile + "personal records" (longest streak, most XP in a day, best league finish). [7] |
| **Quests** | Daily quests + weekly Friends Quests (paired, 5 days, shared goal) — cooperative, not competitive. [8] |

Caveats from research:
- Meta-analysis (Sailer & Homner 2019): gamification has small-to-medium effects — cognitive g=.49, motivational g=.36, behavioral g=.25; motivational effects are the least stable. [9]
- Motivation fades once the novelty wears off; competition and repetition can't replace meaningful feedback. [10]
- **XP gets gamed.** Duolingo saw end-of-month XP grinding and had to reweight XP toward real path progress (their "Time Spent Learning Well" metric: path minutes + 0.5 × other minutes). [11]

Framework lens (Octalysis): Accomplishment, Meaning, Creativity ("white hat") build long-term loyalty. Loss avoidance, scarcity, unpredictability ("black hat") create urgency but cause anxiety if overused. [12]

## 2. UI patterns

- **Home hub** — the top bar is a stat strip (streak flame, points, level). Below it sits one dominant "Continue / Log study" CTA, then bento cards: streak, today's goal ring, a 7-day week strip, a quest card and a league card. Key detail: exactly one primary action per screen; everything else is a glanceable card.
- **Learning path/map** — a vertical zig-zag of round nodes grouped into units, each unit with a colored banner and a guidebook button. Nodes are done (gold), current (bouncing, with a "Start" callout) or locked (grey). A floating "jump to current" button handles long paths. [6] Key detail: the current node is always the visual focus.
- **Streak** — a big number with a flame/character, a month calendar with active days filled and freeze days marked, milestone callouts (7/30/100/365) and share cards. [2][13] Key detail: fire metaphors don't carry across all cultures, so Duolingo moved toward a phoenix. Test the metaphor with Mongolian users.
- **Daily goal** — a ring or bar filling toward a user-chosen target (e.g. 5/10/15/20 min), kept *separate* from the streak. [1] Key detail: the goal is adjustable, and missing it never breaks the streak.
- **XP/levels** — a points counter plus a level badge with a progress bar to the next level. Key detail: weight points toward meaningful activity and cap farming (ADR 0005 already caps at 60/session). [11]
- **Quests/challenges** — 3 daily quests as cards with progress bars and a chest icon, a monthly badge quest and a weekly cooperative quest. [8] Key detail: vary the quests; they give a reason to return beyond the streak.
- **Leagues/leaderboard** — tier badge at the top, countdown to reset, a ranked list with the user's row highlighted and pinned, green promotion and red demotion zones, a podium for the top 3. [5] Key detail: match by activity level, not globally, and let users opt out.
- **Rewards/celebrations** — a full-screen session-complete screen (points earned, minutes, accuracy) with a character animation and confetti, plus milestone and chest-open moments. Key detail: animation timing matters more than asset richness. [13]
- **Mascot/feedback** — a simple geometric, expressive character (Duo is "a body with wings, big eyes"). [14] It appears in empty states, celebrations and gentle reminders. Key detail: use it for encouragement, not guilt.
- **App shell** — mobile: a bottom tab bar with 4–5 icon+label tabs, and a top stat strip on key tabs. Duolingo unified headers, type and spacing across tabs and saw higher engagement. [15]

## 3. Desktop vs mobile

- **Mobile:** single column, bottom tabs, top stat strip, full-screen lesson and celebration flows that hide the tabs, and a thumb-reach CTA.
- **Desktop (as seen on duolingo.com):** three columns.
  - **Left:** a fixed sidebar nav (Learn, Leaderboards, Quests, Shop, Profile, More).
  - **Center:** the path or main content, about 600px.
  - **Right rail (~370px):** a stat strip, league card, daily quests card and a promo/profile CTA.
  - Lesson flows go full-width, with no chrome.
- **Implication for StepUp:** ADR 0006 puts nav inline in a desktop top bar. That fits a site, but an "app" feel on desktop usually means a left sidebar plus a right rail of gamification cards. Consider revisiting 0006 for the signed-in area; public/marketing pages can keep the top bar.

## 4. Pitfalls — adults and a tracker-first MVP

- **Streak anxiety and guilt nudges.** Loss aversion can turn "learn English" into "don't lose the number." The sad-mascot guilt messaging is widely criticized. [16] Use freezes or repair, a weekly-goal alternative, and warm reminder copy.
- **Self-reported minutes are easy to inflate.** Points from manual logs invite padding. Keep caps, reward consistency (days) over volume, and don't make a public league of unverifiable minutes. Friends-only or opt-in leagues fit better, or no league until modules produce verifiable activity.
- **Empty leaderboards look dead.** With few users, leagues feel empty. Use personal records and "you vs last week" first.
- **Hollow rewards.** Badges that don't reflect learning erode trust with adults. [16] Tie milestones to real behavior, and later to CEFR progress.
- **Childish tone.** Adults prefer calmer apps like Busuu and Babbel. [17] Offer a playful-but-grown-up look, reduced motion and a notification-intensity setting.
- **Novelty decay.** Plan quest rotation and new modules, not just more badges. [10]
- **Path before content.** Showing locked nodes with nothing behind them feels broken. Show a "roadmap" of skills (ADR 0006) as coming-soon nodes, clearly labeled.

## 5. Recommended MVP gamified shell

**Screens**
1. Home hub (stat strip, "Log study" CTA, streak card, goal ring, week strip, quests, level progress)
2. Log study sheet (bottom sheet: skill, minutes stepper, note) → Session-complete celebration
3. Streak detail (calendar, milestones, freeze/repair, share card)
4. Progress (minutes per day/week chart, per-skill split, personal records)
5. Quests (3 daily + 1 weekly)
6. Profile (avatar, level badge, stats, trophy shelf, settings: goal, reminders, public/private)
7. Skills roadmap/path (4 skills as nodes; coming-soon states)
8. Onboarding (goal picker, level self-assessment/placement stub, reminder time)
9. Later: Leaderboard (friends/opt-in first)

**Components**
- *App shell:* AppShell (bottom tabs on mobile; sidebar + right rail at ≥ lg), TopStatStrip (streak, points, level chips)
- *Hub cards:* BentoCard, StreakCard, WeekStrip (7 day dots), ProgressRing, LevelBadge + XPBar, QuestCard (progress bar, reward icon)
- *Streak:* StreakCalendar, MilestoneBadge, FreezeToken
- *Logging and celebration:* PrimaryCTA (chunky 3D-press button), BottomSheet, MinuteStepper, SkillChip, CelebrationOverlay (confetti + count-up + mascot), Toast
- *Mascot:* Mascot (states: idle, cheer, sleepy, thinking), EmptyState
- *Path and leagues:* PathNode (done/current/locked/soon), UnitHeader, LeaderboardRow, Podium, PromotionZoneDivider (latter three deferred)

## Sources

1. Duolingo — Improving the streak: https://blog.duolingo.com/improving-the-streak/
2. Duolingo — How the streak builds habit: https://blog.duolingo.com/how-duolingo-streak-builds-habit/
3. Silverman & Barasch, "On or Off Track: How (Broken) Streaks Affect Consumer Decisions," JCR 2023: https://academic.oup.com/jcr/article-abstract/49/6/1095/6623414
4. Jorge Mazal (ex-Duolingo CPO), How Duolingo reignited user growth: https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
5. Duolingo — How Leaderboards and Leagues work: https://blog.duolingo.com/duolingo-leagues-leaderboards/
6. Duolingo — New learning path: https://blog.duolingo.com/new-duolingo-home-screen-design/ ; efficacy: https://blog.duolingo.com/results-duolingo-efficacy-studies/
7. Duolingo — Achievement badges: https://blog.duolingo.com/achievement-badges/
8. Duolingo — Friends Quests: https://blog.duolingo.com/friends-quests/
9. Sailer & Homner, The Gamification of Learning: a Meta-analysis (2019): https://link.springer.com/article/10.1007/s10648-019-09498-w
10. Gamification, motivation and learning outcomes in online language learning (Frontiers 2024): https://pmc.ncbi.nlm.nih.gov/articles/PMC11163042/ ; systematic review: https://pmc.ncbi.nlm.nih.gov/articles/PMC10448467/
11. Duolingo — Time Spent Learning Well: https://blog.duolingo.com/time-spent-learning-well/
12. Yu-kai Chou — Octalysis / White vs Black Hat: https://yukaichou.com/gamification-study/white-hat-black-hat-gamification-octalysis-framework/
13. Duolingo — Animating the streak: https://blog.duolingo.com/streak-milestone-design-animation/
14. Duolingo — Reshaping Duo / Building character: https://blog.duolingo.com/reshaping-duo/ , https://blog.duolingo.com/building-character/
15. Duolingo — Core tabs redesign: https://blog.duolingo.com/core-tabs-redesign/
16. The Decision Lab — Streak Creep: https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification
17. NN/g — Autonomy, Relatedness, Competence: https://www.nngroup.com/articles/autonomy-relatedness-competence/ ; Busuu vs gamified apps (secondary): https://languageappguide.com/app-reviews/busuu-review/
