import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Танилцъя · StepUp English" };

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (profile?.onboardedAt) redirect("/");

  return <OnboardingForm name={profile?.displayName ?? ""} />;
}
