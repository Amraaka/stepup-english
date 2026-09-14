"use client";

import Link from "next/link";
import { useStats } from "@/components/stats-provider";
import {
  DAILY_GOAL_MIN,
  activeDaysInWeek,
  dailyQuests,
  fmtDuration,
  fmtNum,
  weekPoints,
  weeklyQuests,
  type Quest,
  type QuestIconName,
} from "@/lib/game";
import { CORE_SKILLS, SKILLS } from "@/lib/skills";
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
  GiftIcon,
  PlusIcon,
  ShieldCheckIcon,
  TargetIcon,
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

export function DailyGoalCard({ className = "" }: { className?: string }) {
  const { stats, openLog } = useStats();
  const pct = Math.min(1, stats.todayMinutes / DAILY_GOAL_MIN);
  const done = pct >= 1;
  const left = Math.max(0, DAILY_GOAL_MIN - stats.todayMinutes);
  const circumference = 2 * Math.PI * 42;

  return (
    <section
      aria-labelledby="goal-h"
      className={`relative flex items-center gap-4 overflow-hidden rounded-[28px] bg-coral-a p-5 text-ink-950 shadow-[0_18px_36px_-18px_rgb(255_90_60/0.7)] sm:p-6 ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h2 id="goal-h" className="text-sm font-extrabold">
          Өдрийн зорилго
        </h2>
        <p className="text-[34px] font-extrabold leading-none tracking-[-0.03em] tabular-nums lg:text-5xl">
          {stats.todayMinutes}
          <span className="text-xl text-ink-950/55 lg:text-2xl"> / {DAILY_GOAL_MIN} мин</span>
        </p>
        <p className="text-[13px] font-semibold text-ink-950/75 text-pretty lg:text-sm">
          {done ? "Зорилго биелсэн — гайхалтай!" : `Зорилгод ${left} минут дутуу байна`}
        </p>
        <div className="mt-2.5">
          <button
            type="button"
            onClick={() => openLog()}
            className="inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink-950 px-5 text-sm font-extrabold text-white transition-transform active:scale-[0.97]"
          >
            {stats.todayPoints > 0 ? "Дахин бүртгэх" : "Цагаа бүртгэх"}
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative size-26 shrink-0 xl:hidden">
        <svg viewBox="0 0 104 104" className="size-full -rotate-90" aria-hidden>
          <circle cx="52" cy="52" r="42" stroke="rgb(255 255 255 / 0.35)" strokeWidth="12" fill="none" />
          {pct > 0 && (
            <circle
              cx="52"
              cy="52"
              r="42"
              stroke="var(--ink-950)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference * pct} ${circumference}`}
            />
          )}
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xl font-extrabold tabular-nums">
          {Math.round(pct * 100)}%
        </span>
      </div>
      <Mascot mood={done ? "cheer" : "happy"} className="-my-4 -mr-3 hidden size-44 shrink-0 xl:block" />
    </section>
  );
}

export function WeeklyChallengeCard({ className = "" }: { className?: string }) {
  const { stats } = useStats();
  const q = weeklyQuests(stats)[0];
  const done = q.value >= q.target;
  return (
    <Link
      href="/quests"
      className={`group flex flex-col justify-between gap-5 rounded-[28px] bg-night p-5 text-ink-100 transition-transform duration-200 hover:-translate-y-0.5 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold tracking-[-0.01em] lg:text-[22px]">7 хоногийн сорил</h2>
          <p className="mt-1 text-[13px] text-ink-400 text-pretty">
            {done
              ? "Энэ долоо хоногийн сорил биеллээ!"
              : `${q.target} минут суралцаад долоо хоногоо дүүргэ`}
          </p>
        </div>
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
            done ? "bg-mint/20 text-[#6fe0b1]" : "bg-sky/20 text-[#8bbcff]"
          }`}
        >
          {done ? <CheckIcon className="size-6 [stroke-width:2.4]" /> : <TargetIcon className="size-6" />}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-2 flex justify-between text-xs font-bold text-ink-400">
            <span>{done ? "Биелсэн" : "Явц"}</span>
            <span className="tabular-nums">
              {Math.min(q.value, q.target)} / {q.target} мин
            </span>
          </div>
          <ProgressBar
            value={q.value}
            max={q.target}
            label="7 хоногийн сорилын явц"
            fill={done ? "bg-mint" : "bg-coral-a"}
            track="bg-white/12"
          />
        </div>
        <span
          aria-hidden
          className="press grid size-14 shrink-0 place-items-center rounded-full bg-coral-a text-ink-950"
        >
          <ChevronRightIcon className="size-6 [stroke-width:2.4]" />
        </span>
      </div>
    </Link>
  );
}

export function WeekCard({ className = "" }: { className?: string }) {
  const { stats } = useStats();
  const active = activeDaysInWeek(stats);
  const copy =
    stats.todayPoints > 0
      ? "Өнөөдрийн өдөр тэмдэглэгдлээ. Маргааш уулзъя!"
      : stats.streak > 0
        ? "Өнөөдөр 5 минут ч болов бүртгээд дарааллаа үргэлжлүүл."
        : "Өнөөдөр нэг удаа бүртгэхэд дараалал эхэлнэ.";
  return (
    <section className={`flex flex-col gap-3.5 rounded-3xl bg-surface p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-extrabold">
          {stats.streak > 0 ? `${stats.streak} хоног дараалан` : "Энэ 7 хоног"}
        </h2>
        <span className="rounded-full bg-sky-soft px-2.5 py-1 text-xs font-bold text-sky-text tabular-nums">
          {active}/7 өдөр
        </span>
      </div>
      <WeekStrip week={stats.week} />
      <p className="text-xs leading-relaxed text-muted">{copy}</p>
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
                <span
                  className={`whitespace-nowrap rounded-full bg-surface px-2 py-1 text-[11px] font-extrabold ${t.text}`}
                >
                  Тун удахгүй
                </span>
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

export function PathPreview() {
  const { openLog } = useStats();
  return (
    <section className="flex flex-col gap-5 rounded-[28px] bg-surface p-5 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">Суралцах зам</h2>
          <p className="text-[13px] text-muted">1-р бүлэг · Өдөр тутмын яриа</p>
        </div>
        <Link
          href="/learn"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-4 text-[13px] font-extrabold text-white dark:bg-ink-100 dark:text-ink-950"
        >
          Зам руу <ArrowRightIcon className="size-4" />
        </Link>
      </div>
      <div className="relative flex items-center justify-between px-1 pb-1 sm:px-4">
        <div aria-hidden className="absolute inset-x-8 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-locked" />
        <button
          type="button"
          onClick={() => openLog()}
          aria-label="Өнөөдрийн бүртгэл хийх"
          className="press relative grid size-14 place-items-center rounded-full bg-coral-a text-ink-950 ring-8 ring-coral-a/20 sm:size-[68px]"
        >
          <PlusIcon className="size-7 [stroke-width:2.4]" />
        </button>
        {CORE_SKILLS.map((s) => (
          <span
            key={s.id}
            title={`${s.name} · тун удахгүй`}
            className="press relative grid size-11 place-items-center rounded-full bg-locked text-ink-400 [--press:var(--locked-deep)] sm:size-14"
          >
            <SkillIcon id={s.id} className="size-5 sm:size-6" />
          </span>
        ))}
        <span className="press relative grid size-12 place-items-center rounded-2xl bg-sun text-ink-950 [--press:var(--sun-deep)] sm:size-14">
          <GiftIcon className="size-6" />
        </span>
      </div>
      <p className="text-xs text-muted">Одоогоор өдрийн бүртгэл нээлттэй. Хичээлүүд удахгүй нэмэгдэнэ.</p>
    </section>
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
