"use client";

import Link from "next/link";
import { useStats } from "@/components/stats-provider";
import { DAILY_GOAL_MIN } from "@/lib/game";
import { Mascot } from "@/components/mascot";
import {
  DailyGoalCard,
  DailyQuestsCard,
  LeagueTeaser,
  PathPreview,
  SignupCard,
  SkillGrid,
  WeekCard,
  WeeklyChallengeCard,
} from "@/components/game/widgets";

export function HomeView({ firstName }: { firstName: string }) {
  const { stats, isGuest } = useStats();
  const done = stats.todayMinutes >= DAILY_GOAL_MIN;

  const subtitle =
    stats.todayMinutes === 0
      ? stats.streak > 0
        ? `${stats.streak} хоног дараалан. Өнөөдрийн алхмаа хийе.`
        : `Өдөрт ${DAILY_GOAL_MIN} минут — жижиг алхмаар ахина.`
      : done
        ? "Өнөөдрийн зорилго биелсэн. Гайхалтай!"
        : `Зорилгод ${DAILY_GOAL_MIN - stats.todayMinutes} минут дутуу байна.`;

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance lg:text-[32px]">
            Сайн уу{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="mt-1 max-w-[34ch] text-sm leading-relaxed text-muted lg:max-w-none lg:text-[15px]">
            {subtitle}
          </p>
        </div>
        <Mascot mood={done ? "cheer" : "happy"} className="size-26 shrink-0 lg:hidden" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <DailyGoalCard />
        <WeeklyChallengeCard />
      </div>

      {isGuest && <SignupCard className="xl:hidden" />}
      <WeekCard className="xl:hidden" />

      <section aria-labelledby="skills-h" className="mt-2 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 id="skills-h" className="text-lg font-extrabold tracking-[-0.01em] lg:text-xl">
            Ур чадвар
          </h2>
          <Link href="/learn" className="text-[13px] font-bold text-coral-a-text">
            Замыг харах
          </Link>
        </div>
        <SkillGrid />
      </section>

      <PathPreview />
      <DailyQuestsCard className="xl:hidden" />
      <LeagueTeaser className="xl:hidden" />
    </div>
  );
}
