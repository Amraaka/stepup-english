import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getLearnPlan } from "@/lib/learn-tracks";
import { LearnView } from "@/components/views/learn-view";

export const metadata: Metadata = { title: "Суралцах · StepUp English" };

export default async function LearnPage() {
  const user = await getCurrentUser();
  return <LearnView plan={await getLearnPlan(user?.id ?? null)} />;
}
