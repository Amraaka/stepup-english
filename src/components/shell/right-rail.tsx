"use client";

import { usePathname } from "next/navigation";
import {
  DailyQuestsCard,
  LeagueTeaser,
  SignupCard,
  StatPills,
  WeekCard,
} from "@/components/game/widgets";

/** Wide-screen progress rail. Skips the card that duplicates the current page. */
export function RightRail({ isGuest }: { isGuest: boolean }) {
  const pathname = usePathname();
  return (
    <aside aria-label="Таны явц" className="sticky top-8 hidden w-[340px] shrink-0 flex-col gap-4 xl:flex">
      <StatPills labeled />
      {isGuest && <SignupCard />}
      <WeekCard />
      {pathname !== "/quests" && <DailyQuestsCard />}
      {pathname !== "/league" && <LeagueTeaser />}
    </aside>
  );
}
