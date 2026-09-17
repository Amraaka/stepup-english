"use client";

import { useStats } from "@/components/stats-provider";
import type { NextStep } from "@/lib/next-step";
import {
  DailyQuestsCard,
  LeagueTeaser,
  NextStepCard,
  SignupCard,
  SkillGrid,
  TodayCard,
  WeekCard,
} from "@/components/game/widgets";

export function HomeView({ firstName, step }: { firstName: string; step: NextStep }) {
  const { isGuest } = useStats();

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance lg:text-[32px]">
        Сайн уу{firstName ? `, ${firstName}` : ""}!
      </h1>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <NextStepCard step={step} />
        <TodayCard />
      </div>

      {isGuest && <SignupCard className="xl:hidden" />}
      <WeekCard className="xl:hidden" />

      <section aria-labelledby="skills-h" className="mt-2 flex flex-col gap-3">
        <h2 id="skills-h" className="text-lg font-extrabold tracking-[-0.01em] lg:text-xl">
          Ур чадвар
        </h2>
        <SkillGrid />
      </section>

      <DailyQuestsCard className="xl:hidden" />
      <LeagueTeaser className="xl:hidden" />
    </div>
  );
}
