import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { getNextStep } from "@/lib/next-step";
import { HomeView } from "@/components/views/home-view";

export default async function Home() {
  const user = await getCurrentUser();
  const [profile, step] = await Promise.all([user ? getProfile(user.id) : null, getNextStep(user?.id ?? null)]);
  const firstName = (profile?.displayName || "").split(" ")[0];
  return <HomeView firstName={firstName} step={step} />;
}
