import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { reviewQueue } from "@/lib/vocab/words";
import { ReviewSession } from "@/components/vocabulary/review-session";

export const metadata: Metadata = { title: "Үг давтах · StepUp English" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  const { cards } = await reviewQueue(user.id, profile?.timezone ?? "Asia/Ulaanbaatar");
  // No redirect when the queue is empty: logging review time revalidates this page
  // mid-session, and the client keeps its own queue and finish screen.
  return <ReviewSession cards={cards} />;
}
