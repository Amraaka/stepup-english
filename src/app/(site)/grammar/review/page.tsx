import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { grammarReviewQueue } from "@/lib/grammar/progress";
import { GrammarPractice } from "@/components/grammar/grammar-practice";

export const metadata: Metadata = { title: "Алдаагаа давтах · Дүрэм · StepUp English" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/grammar");
  const profile = await getProfile(user.id);
  const items = await grammarReviewQueue(user.id, profile?.timezone ?? "Asia/Ulaanbaatar");
  // Always render the session: logging time revalidates this page, and the session keeps its items from mount.
  return <GrammarPractice items={items} mode={{ kind: "review" }} />;
}
