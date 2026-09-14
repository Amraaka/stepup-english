import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardStats, getProfile } from "@/lib/activity";
import { SIDEBAR_COOKIE } from "@/lib/ui-prefs";
import { StatsProvider } from "@/components/stats-provider";
import { AppShell } from "@/components/shell/app-shell";

/** Every in-app page shares one stats source and the gamified shell. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const profile = user ? await getProfile(user.id) : null;
  // First sign-in (email or Google): collect level + goals before the app.
  if (user && !profile?.onboardedAt) redirect("/onboarding");
  const stats = user
    ? await getDashboardStats(user.id, profile?.timezone ?? "Asia/Ulaanbaatar")
    : null;
  const sidebarCollapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "collapsed";

  return (
    <StatsProvider initial={stats}>
      <AppShell
        account={user ? { name: profile?.displayName ?? "", email: user.email ?? "" } : null}
        sidebarCollapsed={sidebarCollapsed}
      >
        {children}
      </AppShell>
    </StatsProvider>
  );
}
