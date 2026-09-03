import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/activity";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileMenu } from "@/components/profile-menu";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getProfile(user.id) : null;

  return (
    <header className="sticky top-0 z-10 border-b border-ink-400/15 bg-background/85 backdrop-blur-md">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="text-[17px] font-extrabold tracking-tight">
            StepUp <span className="font-semibold text-muted">English</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {!user && (
            <nav className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-ink-50 hover:text-foreground dark:hover:bg-ink-900"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/login?mode=signup"
                className="hidden rounded-lg bg-ink-900 px-3.5 py-1.5 text-sm font-semibold text-ink-100 transition-opacity hover:opacity-90 sm:block dark:bg-ink-100 dark:text-ink-950"
              >
                Бүртгүүлэх
              </Link>
            </nav>
          )}
          <ThemeToggle />
          {user && (
            <ProfileMenu
              name={profile?.displayName ?? ""}
              email={user.email ?? ""}
            />
          )}
        </div>
      </div>
    </header>
  );
}
