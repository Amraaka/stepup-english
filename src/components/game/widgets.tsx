"use client";

import Link from "next/link";
import { useStats } from "@/components/stats-provider";
import {
  DAILY_GOAL_MIN,
  WEEK_GOAL_MIN,
  activeDaysInWeek,
  dailyQuests,
  fmtDuration,
  fmtNum,
  weekMinutes,
  weekPoints,
  type Quest,
  type QuestIconName,
} from "@/lib/game";
import type { NextStep } from "@/lib/next-step";
import { SKILLS } from "@/lib/skills";
import { TONE } from "@/lib/tones";
import { Mascot } from "@/components/mascot";
import { SkillIcon } from "@/components/skill-icon";
import { WeekStrip } from "@/components/game/week-strip";
import { ProgressBar } from "@/components/game/progress-bar";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  FlameIcon,
  PlusIcon,
  ReplayIcon,
  ShieldCheckIcon,
} from "@/components/icons";

/** Streak + points. Compact pill for the top bar; `labeled` card for the rail. */
export function StatPills({ className = "", labeled = false }: { className?: string; labeled?: boolean }) {
  const { stats } = useStats();
  const lit = stats.streak > 0;

  if (labeled) {
    return (
      <div className={`grid grid-cols-2 rounded-3xl bg-surface p-1.5 ${className}`}>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${lit ? "bg-coral-soft" : "bg-ink-400/12"}`}>
            <FlameIcon className={`size-5 ${lit ? "fill-coral-a text-coral-a" : "text-ink-400"}`} />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-extrabold leading-none tabular-nums">{stats.streak}</p>
            <p className="mt-1 truncate text-xs text-muted">дараалал</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-l border-line px-3 py-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun-soft">
            <BoltIcon className="size-5 fill-sun-icon text-sun-icon" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-extrabold leading-none tabular-nums">{fmtNum(stats.totalPoints)}</p>
            <p className="mt-1 truncate text-xs text-muted">нийт оноо</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-10 items-center gap-3 rounded-full bg-surface px-3.5 shadow-[0_6px_18px_-10px_rgb(18_18_21/0.25)] ${className}`}
    >
      <span className="flex items-center gap-1">
        <FlameIcon className={`size-5 ${lit ? "fill-coral-a text-coral-a" : "text-ink-400"}`} />
        <b className="text-[15px] tabular-nums">{stats.streak}</b>
        <span className="sr-only">хоног дараалан</span>
      </span>
      <span aria-hidden className="h-4.5 w-px bg-ink-400/30" />
      <span className="flex items-center gap-1">
        <BoltIcon className="size-5 fill-sun-icon text-sun-icon" />
        <b className="text-[15px] tabular-nums">{fmtNum(stats.totalPoints)}</b>
        <span className="sr-only">оноо</span>
      </span>
    </div>
  );
}

/** The one thing to do now: the next lesson, plus any reviews due today. */
export function NextStepCard({ step, className = "" }: { step: NextStep; className?: string }) {
  const { stats } = useStats();
  const { main, reviews } = step;
  const done = stats.todayMinutes >= DAILY_GOAL_MIN;
  return (
    <section
      aria-labelledby="next-h"
      className={`relative flex flex-col overflow-hidden rounded-[28px] bg-coral-a text-ink-950 shadow-[0_18px_36px_-18px_rgb(255_90_60/0.7)] ${className}`}
    >
      <div className="relative flex flex-1 items-center gap-3 p-5 sm:p-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 id="next-h" className="text-sm font-extrabold">
            Өнөөдрийн алхам
          </h2>
          <p className="mt-3 text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance lg:text-[32px]">
            {main.title}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-ink-950/75">{main.subtitle}</p>
          <p className="mt-1 text-xs font-bold text-ink-950/60 tabular-nums">
            {main.meta} · {main.done}/{main.total} хичээл
          </p>
          <Link
            href={main.href}
            className="press mt-5 inline-flex h-12 w-fit items-center gap-2 whitespace-nowrap rounded-full bg-ink-950 px-6 text-[15px] font-extrabold text-white [--press:rgb(0_0_0/0.35)]"
          >
            {main.action}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <Mascot mood={done ? "cheer" : "happy"} className="-my-4 -mr-2 hidden size-40 shrink-0 sm:block lg:hidden" />
      </div>
      {reviews.length > 0 && (
        <ul className="flex flex-wrap gap-2 border-t border-ink-950/12 px-5 py-3.5 sm:px-6">
          {reviews.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-white/30 pl-2 pr-3.5 text-[13px] font-extrabold transition-colors hover:bg-white/45"
              >
                <span className="grid size-7 place-items-center rounded-full bg-ink-950 text-white">
                  <ReplayIcon className="size-3.5" />
                </span>
                {r.label}
                <span className="tabular-nums text-ink-950/65">{r.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Today's minutes against the daily goal; manual logging lives here as a secondary action. */
export function TodayCard({ className = "" }: { className?: string }) {
  const { stats, openLog } = useStats();
  const pct = Math.min(1, stats.todayMinutes / DAILY_GOAL_MIN);
  const done = pct >= 1;
  const left = Math.max(0, DAILY_GOAL_MIN - stats.todayMinutes);
  const circumference = 2 * Math.PI * 42;
  const note = done
    ? "Өдрийн зорилго биелсэн. Гайхалтай!"
    : stats.todayMinutes > 0
      ? `Зорилгод ${left} минут үлдлээ.`
      : stats.streak > 0
        ? `${stats.streak} хоногийн дарааллаа үргэлжлүүлэхэд ганц хичээл хангалттай.`
        : "Хичээл, дасгалын цаг автоматаар тоологдоно.";

  return (
    <section
      aria-labelledby="today-h"
      className={`flex flex-col gap-4 rounded-[28px] bg-night p-5 text-ink-100 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 104 104" className="size-full -rotate-90" aria-hidden>
            <circle cx="52" cy="52" r="42" stroke="rgb(255 255 255 / 0.1)" strokeWidth="11" fill="none" />
            {pct > 0 && (
              <circle
                cx="52"
                cy="52"
                r="42"
                stroke={done ? "var(--mint)" : "var(--coral-a)"}
                strokeWidth="11"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circumference * pct} ${circumference}`}
                className="transition-[stroke-dasharray] duration-700 ease-out"
              />
            )}
          </svg>
          <span className="absolute inset-0 grid place-items-center">
            {done ? (
              <CheckIcon className="size-8 text-[#6fe0b1] [stroke-width:2.6]" />
            ) : (
              <ClockIcon className="size-7 text-ink-400" />
            )}
          </span>
        </div>
        <div className="min-w-0">
          <h2 id="today-h" className="text-sm font-extrabold text-ink-400">
            Өнөөдөр
          </h2>
          <p className="mt-1 text-[34px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
            {stats.todayMinutes}
            <span className="text-lg text-ink-400"> / {DAILY_GOAL_MIN} мин</span>
          </p>
          <p className="mt-2 text-[13px] leading-snug text-ink-400 text-pretty">{note}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => openLog()}
        className="mt-auto flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-white/8 text-[13px] font-bold text-ink-100 transition-colors hover:bg-white/14"
      >
        <PlusIcon className="size-4 [stroke-width:2.4]" />
        Гадуур суралцсан цаг нэмэх
      </button>
    </section>
  );
}

/** The calendar week (Mon–Sun): active days and the weekly minutes goal. */
export function WeekCard({ className = "" }: { className?: string }) {
  const { stats } = useStats();
  const minutes = weekMinutes(stats);
  const reached = minutes >= WEEK_GOAL_MIN;
  const copy =
    stats.todayPoints > 0
      ? "Өнөөдрийн өдөр тэмдэглэгдлээ. Маргааш уулзъя!"
      : stats.streak > 0
        ? `${stats.streak} хоног дараалан. Өнөөдөр ч гэсэн нэг алхам хийгээрэй.`
        : "Өнөөдөр суралцвал дараалал эхэлнэ.";
  return (
    <section aria-labelledby="week-h" className={`flex flex-col gap-3.5 rounded-3xl bg-surface p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 id="week-h" className="text-[15px] font-extrabold">
          Энэ 7 хоног
        </h2>
        <span className="text-xs font-bold text-muted tabular-nums">{activeDaysInWeek(stats)}/7 өдөр</span>
      </div>
      <WeekStrip days={stats.days} />
      <p className="text-xs leading-relaxed text-muted">{copy}</p>
      <div className="border-t border-line pt-3.5">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <p className="text-[13px] font-extrabold">7 хоногийн зорилго</p>
          <p className={`text-xs font-bold tabular-nums ${reached ? "text-mint-text" : "text-muted"}`}>
            {Math.min(minutes, WEEK_GOAL_MIN)}/{WEEK_GOAL_MIN} мин
          </p>
        </div>
        <ProgressBar
          value={minutes}
          max={WEEK_GOAL_MIN}
          label="7 хоногийн зорилго"
          fill={reached ? "bg-mint" : "bg-sky"}
        />
        <p className="mt-2 text-[11px] text-muted">
          {reached ? "Энэ 7 хоногийн зорилго биеллээ!" : "Даваа гараг бүр шинээр эхэлнэ."}
        </p>
      </div>
    </section>
  );
}

function QuestIcon({ icon, className }: { icon: QuestIconName; className?: string }) {
  const Icon = { clock: ClockIcon, check: CheckIcon, bolt: BoltIcon, flame: FlameIcon }[icon];
  return <Icon className={className} />;
}

export function QuestRows({ quests }: { quests: Quest[] }) {
  return (
    <ul className="flex flex-col">
      {quests.map((q, i) => {
        const t = TONE[q.tone];
        const done = q.value >= q.target;
        return (
          <li key={q.id} className={`flex items-center gap-3 py-3 ${i > 0 ? "border-t border-line" : ""}`}>
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${t.soft} ${t.icon}`}>
              <QuestIcon icon={q.icon} className="size-5" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-bold">{q.title}</p>
                <span
                  className={`shrink-0 text-xs font-bold tabular-nums ${done ? "text-mint-text" : "text-muted"}`}
                >
                  {Math.min(q.value, q.target)}/{q.target}
                </span>
              </div>
              <ProgressBar value={q.value} max={q.target} label={q.title} fill={done ? "bg-mint" : t.solid} />
            </div>
            {done ? (
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-white">
                <CheckIcon className="size-5 [stroke-width:2.6]" />
                <span className="sr-only">биелсэн</span>
              </span>
            ) : (
              <span aria-hidden className="size-9 shrink-0 rounded-full border-2 border-dashed border-ink-400/40" />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function DailyQuestsCard({ className = "" }: { className?: string }) {
  const { stats } = useStats();
  const quests = dailyQuests(stats);
  const done = quests.filter((q) => q.value >= q.target).length;
  return (
    <section className={`overflow-hidden rounded-3xl bg-surface ${className}`}>
      <div className="flex items-center justify-between gap-2 px-4 pt-3.5">
        <h2 className="text-[15px] font-extrabold">Өнөөдрийн даалгавар</h2>
        <span className="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-bold text-mint-text tabular-nums">
          {done}/{quests.length} биелсэн
        </span>
      </div>
      <div className="px-4">
        <QuestRows quests={quests} />
      </div>
      <Link
        href="/quests"
        className="flex h-11 items-center justify-center gap-1 border-t border-line text-[13px] font-bold text-coral-a-text transition-colors hover:bg-canvas"
      >
        Бүх даалгавар <ChevronRightIcon className="size-4" />
      </Link>
    </section>
  );
}

export function LeagueTeaser({ className = "" }: { className?: string }) {
  const { stats } = useStats();
  return (
    <Link
      href="/league"
      className={`flex items-center gap-3 rounded-3xl bg-surface p-4 transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(160deg,#c9d2de,#8e9aad)] text-white">
        <ShieldCheckIcon className="size-7 [stroke-width:2]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold">Лиг · тун удахгүй</p>
        <p className="text-xs text-muted">
          Энэ 7 хоногт <b className="text-foreground tabular-nums">{fmtNum(weekPoints(stats))}</b> оноо
          цуглуулсан
        </p>
      </div>
      <ChevronRightIcon className="size-5 shrink-0 text-muted" />
    </Link>
  );
}

export function SignupCard({ className = "" }: { className?: string }) {
  return (
    <section className={`rounded-3xl bg-night p-5 text-ink-100 ${className}`}>
      <h2 className="text-base font-extrabold">Явцаа хадгалах уу?</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
        Одоо бүртгэл тань зөвхөн энэ төхөөрөмжид байна. Бүртгүүлбэл хаанаас ч үргэлжлүүлнэ.
      </p>
      <Link
        href="/login?mode=signup"
        className="press mt-4 flex h-11 items-center justify-center rounded-2xl bg-coral-a text-sm font-extrabold text-ink-950"
      >
        Үнэгүй бүртгүүлэх
      </Link>
    </section>
  );
}

export function SkillGrid() {
  const { stats } = useStats();
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-3.5">
      {SKILLS.map((s) => {
        const t = TONE[s.tone];
        const min = stats.moduleMinutes[s.id] ?? 0;
        return (
          <li key={s.id}>
            <Link
              href={s.href}
              className={`flex h-full flex-col gap-3 rounded-[22px] ${t.soft} p-4 transition-transform duration-200 hover:-translate-y-0.5 lg:p-[18px]`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`grid size-11 shrink-0 place-items-center rounded-[14px] bg-surface ${t.icon}`}>
                  <SkillIcon id={s.id} className="size-6" />
                </span>
                {!s.live && (
                  <span
                    className={`whitespace-nowrap rounded-full bg-surface px-2 py-1 text-[11px] font-extrabold ${t.text}`}
                  >
                    Тун удахгүй
                  </span>
                )}
              </div>
              <div>
                <p className="text-base font-extrabold lg:text-[17px]">{s.name}</p>
                <p className={`text-xs font-semibold ${t.text} lg:text-[13px]`}>
                  {min > 0 ? `${fmtDuration(min)} бүртгэсэн` : s.english}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function LogButton({
  module,
  children,
  className = "",
}: {
  module?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { openLog } = useStats();
  return (
    <button
      type="button"
      onClick={() => openLog(module)}
      className={`press inline-flex h-12 items-center gap-2 rounded-2xl bg-coral-a px-5 text-sm font-extrabold text-ink-950 ${className}`}
    >
      <PlusIcon className="size-5 [stroke-width:2.2]" />
      {children}
    </button>
  );
}
