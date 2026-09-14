"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SKILLS, type SkillId } from "@/lib/skills";
import { TONE } from "@/lib/tones";
import { useSidebar } from "@/components/shell/shell-frame";
import {
  ChevronRightIcon,
  HomeIcon,
  MapIcon,
  ShieldCheckIcon,
  TargetIcon,
  UserIcon,
} from "@/components/icons";

const NAV = [
  { href: "/", label: "Нүүр", Icon: HomeIcon },
  { href: "/learn", label: "Суралцах", Icon: MapIcon },
  { href: "/quests", label: "Даалгавар", Icon: TargetIcon },
  { href: "/league", label: "Лиг", Icon: ShieldCheckIcon },
  { href: "/profile", label: "Профайл", Icon: UserIcon },
];

// Active skill link tints with its own tone (static strings for Tailwind).
const SKILL_ACTIVE: Record<SkillId, string> = {
  listening: "aria-[current=page]:bg-sky-soft",
  reading: "aria-[current=page]:bg-mint-soft",
  writing: "aria-[current=page]:bg-sun-soft",
  speaking: "aria-[current=page]:bg-violet-soft",
  vocabulary: "aria-[current=page]:bg-teal-soft",
  grammar: "aria-[current=page]:bg-rose-soft",
};

/** Visibility helpers driven by ShellFrame's data-sidebar attribute. */
const EXPANDED_ONLY = "group-data-[sidebar=collapsed]/shell:hidden";
const COLLAPSED_ONLY = "hidden group-data-[sidebar=collapsed]/shell:block";
const RAIL_ITEM = "group-data-[sidebar=collapsed]/shell:justify-center group-data-[sidebar=collapsed]/shell:px-0";

/** Label bubble for icon-only rail items (hover or keyboard focus). */
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={`pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-ink-100 dark:text-ink-950 ${COLLAPSED_ONLY}`}
    >
      {children}
    </span>
  );
}

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

/** Desktop: left sidebar that collapses to a 76px icon rail. */
export function SideNav({ account }: { account: React.ReactNode }) {
  const isActive = useIsActive();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside className="sticky top-0 z-30 hidden h-dvh flex-col border-r border-line bg-surface px-3 py-5 lg:flex">
      {/* Sits on the sidebar's right edge, top corner — takes no width from the wordmark. */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Цэсийг дэлгэх" : "Цэсийг хураах"}
        title={collapsed ? "Цэсийг дэлгэх" : "Цэсийг хураах"}
        className="absolute -right-3.5 top-6 z-10 grid size-7 place-items-center rounded-full border border-line bg-surface text-muted shadow-[0_2px_8px_-2px_rgb(18_18_21/0.2)] transition-colors hover:border-coral-a hover:text-coral-a-text"
      >
        <ChevronRightIcon className={`size-4 [stroke-width:2.2] ${collapsed ? "" : "rotate-180"}`} />
      </button>
      <Link
        href="/"
        aria-label="StepUp English — нүүр"
        className="mb-6 flex items-center gap-2.5 px-1.5 group-data-[sidebar=collapsed]/shell:justify-center group-data-[sidebar=collapsed]/shell:px-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" className="size-9 shrink-0 dark:rounded-xl dark:bg-ink-100 dark:p-1" />
        <span className={`whitespace-nowrap text-lg font-extrabold tracking-[-0.02em] ${EXPANDED_ONLY}`}>
          StepUp <span className="font-semibold text-muted">English</span>
        </span>
      </Link>

      <nav aria-label="Үндсэн цэс" className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={`group relative flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-muted transition-colors hover:bg-canvas hover:text-foreground aria-[current=page]:bg-coral-soft aria-[current=page]:font-extrabold aria-[current=page]:text-coral-a-text ${RAIL_ITEM}`}
          >
            <Icon className="size-[22px] shrink-0 group-aria-[current=page]:[stroke-width:2.2]" />
            <span className={`truncate ${EXPANDED_ONLY}`}>{label}</span>
            <Tip>{label}</Tip>
          </Link>
        ))}
      </nav>

      <p className={`px-3 pb-1 pt-7 text-xs font-bold text-muted ${EXPANDED_ONLY}`}>Ур чадвар</p>
      <div aria-hidden className={`mx-auto my-4 h-px w-8 bg-line ${COLLAPSED_ONLY}`} />
      <nav aria-label="Ур чадвар" className="flex flex-col gap-0.5">
        {SKILLS.map((s) => (
          <Link
            key={s.id}
            href={s.href}
            aria-current={isActive(s.href) ? "page" : undefined}
            className={`group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-foreground transition-colors hover:bg-canvas aria-[current=page]:font-extrabold ${SKILL_ACTIVE[s.id]} ${RAIL_ITEM}`}
          >
            <span className="grid w-[22px] shrink-0 place-items-center">
              <span className={`size-2.5 rounded-[3px] ${TONE[s.tone].solid}`} />
            </span>
            <span className={`truncate ${EXPANDED_ONLY}`}>{s.name}</span>
            <Tip>{s.name}</Tip>
          </Link>
        ))}
      </nav>

      <div className="flex-1" />
      {account}
    </aside>
  );
}

/** Mobile: fixed bottom tab bar. */
export function TabBar() {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="Доод цэс"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-md px-1.5 pb-[env(safe-area-inset-bottom)] pt-2">
        {NAV.map(({ href, label, Icon }) => (
          <li key={href} className="flex-1">
            <Link
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className="group flex min-h-14 flex-col items-center gap-1 text-[11px] font-semibold text-muted aria-[current=page]:font-extrabold aria-[current=page]:text-coral-a-text"
            >
              <span className="grid h-8 w-13 place-items-center rounded-full transition-colors group-aria-[current=page]:bg-coral-soft">
                <Icon className="size-[22px] group-aria-[current=page]:[stroke-width:2.2]" />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
