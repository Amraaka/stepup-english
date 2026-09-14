import type { Metadata } from "next";
import { LeagueView } from "@/components/views/league-view";

export const metadata: Metadata = { title: "Лиг · StepUp English" };

export default function LeaguePage() {
  return <LeagueView />;
}
