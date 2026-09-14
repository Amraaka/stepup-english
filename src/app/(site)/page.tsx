import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { HomeView } from "@/components/views/home-view";

export default async function Home() {
  const user = await getCurrentUser();
  const profile = user ? await getProfile(user.id) : null;
  const firstName = (profile?.displayName || "").split(" ")[0];
  return <HomeView firstName={firstName} />;
}
