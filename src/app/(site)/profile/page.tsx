import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { ProfileView } from "@/components/views/profile-view";

export const metadata: Metadata = { title: "Профайл · StepUp English" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = user ? await getProfile(user.id) : null;
  const joined = profile
    ? new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: profile.timezone })
        .format(profile.createdAt)
        .replace("-", ".")
    : null;

  return <ProfileView name={profile?.displayName ?? ""} email={user?.email ?? ""} joined={joined} />;
}
