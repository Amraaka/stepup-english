import Link from "next/link";
import { SideNav, TabBar } from "@/components/shell/nav";
import { RightRail } from "@/components/shell/right-rail";
import { ShellFrame } from "@/components/shell/shell-frame";
import { ProfileMenu } from "@/components/profile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatPills } from "@/components/game/widgets";
import { SignInIcon } from "@/components/icons";

export type Account = { name: string; email: string } | null;

const RAIL_STACK = "group-data-[sidebar=collapsed]/shell:flex-col group-data-[sidebar=collapsed]/shell:px-0";

function SidebarAccount({ account }: { account: Account }) {
  if (!account) {
    // The signup call-to-action lives in the page and rail; keep this quiet.
    return (
      <div className={`flex items-center gap-2 border-t border-line px-1 pt-4 ${RAIL_STACK}`}>
        <Link
          href="/login"
          aria-label="Нэвтрэх"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-sm font-bold transition-colors hover:bg-canvas group-data-[sidebar=collapsed]/shell:w-11 group-data-[sidebar=collapsed]/shell:flex-none"
        >
          <SignInIcon className="hidden size-5 group-data-[sidebar=collapsed]/shell:block" />
          <span className="group-data-[sidebar=collapsed]/shell:hidden">Нэвтрэх</span>
        </Link>
        <ThemeToggle />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center gap-2.5 rounded-2xl bg-canvas p-2 group-data-[sidebar=collapsed]/shell:bg-transparent group-data-[sidebar=collapsed]/shell:p-0 ${RAIL_STACK}`}
    >
      <ProfileMenu name={account.name} email={account.email} placement="up" />
      <div className="min-w-0 flex-1 group-data-[sidebar=collapsed]/shell:hidden">
        <p className="truncate text-sm font-bold">{account.name || "Суралцагч"}</p>
        <p className="truncate text-xs text-muted">{account.email}</p>
      </div>
      <ThemeToggle />
    </div>
  );
}

/** Gamified app frame: sidebar + right rail on desktop, top bar + tabs on phones. */
export function AppShell({
  account,
  sidebarCollapsed,
  children,
}: {
  account: Account;
  sidebarCollapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <ShellFrame initialCollapsed={sidebarCollapsed}>
      <SideNav account={<SidebarAccount account={account} />} />

      <div className="min-w-0">
        <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md lg:hidden">
          <div className="flex h-14 items-center justify-between gap-2 px-4 sm:px-6">
            <Link href="/" aria-label="StepUp English — нүүр">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" className="size-8 dark:rounded-lg dark:bg-ink-100 dark:p-0.5" />
            </Link>
            <div className="flex items-center gap-1">
              <StatPills />
              {account ? (
                <ProfileMenu name={account.name} email={account.email} />
              ) : (
                <Link href="/login" className="flex h-11 items-center rounded-full px-3 text-sm font-bold">
                  Нэвтрэх
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[1200px] items-start group-data-[sidebar=collapsed]/shell:max-w-[1440px] gap-8 px-4 pb-28 pt-3 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <main className="min-w-0 flex-1">{children}</main>
          <RightRail isGuest={!account} />
        </div>
      </div>

      <TabBar />
    </ShellFrame>
  );
}
