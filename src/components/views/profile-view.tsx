"use client";

import { useStats } from "@/components/stats-provider";
import { achievements, fmtDuration, fmtNum, levelFor, type Achievement } from "@/lib/game";
import { SKILLS } from "@/lib/skills";
import { TONE, type Tone } from "@/lib/tones";
import { Mascot } from "@/components/mascot";
import { ProgressBar } from "@/components/game/progress-bar";
import { SignupCard } from "@/components/game/widgets";
import {
  ArrowUpIcon,
  BoltIcon,
  CalendarIcon,
  ClockIcon,
  FlameIcon,
  LockIcon,
  MedalIcon,
} from "@/components/icons";

const BADGE_ICONS: Record<Achievement["icon"], (p: { className?: string }) => React.JSX.Element> = {
  arrow: ArrowUpIcon,
  flame: FlameIcon,
  clock: ClockIcon,
  bolt: BoltIcon,
  medal: MedalIcon,
};

const DEEP: Record<Tone, string> = {
  coral: "[--press:var(--coral-deep)]",
  sky: "[--press:var(--sky-deep)]",
  mint: "[--press:var(--mint-deep)]",
  sun: "[--press:var(--sun-deep)]",
  violet: "[--press:var(--violet-deep)]",
  teal: "[--press:var(--teal-deep)]",
  rose: "[--press:var(--rose-deep)]",
};

const WEEKDAYS_MON = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];
const HEAT = ["bg-ink-400/12", "bg-coral-a/35", "bg-coral-a/65", "bg-coral-a"];

/** Five whole Monday-first weeks ending with the current week. */
function calendarCells(days: { day: string; points: number }[]) {
  const points = new Map(days.map((d) => [d.day, d.points]));
  const today = days[days.length - 1].day;
  const t = new Date(`${today}T12:00:00Z`);
  const start = new Date(t);
  start.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7) - 28);
  const max = Math.max(1, ...days.map((d) => d.points));
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    const p = points.get(key) ?? 0;
    const level = p === 0 ? 0 : p / max < 0.34 ? 1 : p / max < 0.67 ? 2 : 3;
    return { key, points: p, level, today: key === today, future: key > today };
  });
}

export function ProfileView({ name, email, joined }: { name: string; email: string; joined: string | null }) {
  const { stats, isGuest } = useStats();
  const lvl = levelFor(stats.totalPoints);
  const activeDays = stats.days.filter((d) => d.points > 0).length;
  const totalMin = Math.max(1, stats.totalMinutes);
  const displayName = isGuest ? "Зочин" : name || "Суралцагч";
  const badges = achievements(stats);
  const cells = calendarCells(stats.days);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Профайл</h1>

      <section className="relative flex flex-col gap-5 overflow-hidden rounded-[28px] bg-night p-5 text-ink-100 sm:p-6">
        <div
          aria-hidden
          className="absolute -right-10 -top-10 size-44 rounded-full bg-[radial-gradient(circle,rgb(255_90_60/0.35),transparent_70%)]"
        />
        <div className="relative flex items-center gap-4">
          {isGuest ? (
            <span className="grid size-18 shrink-0 place-items-center rounded-[22px] bg-coral-a/15">
              <Mascot mood="happy" className="size-14" />
            </span>
          ) : (
            <span className="grid size-18 shrink-0 place-items-center rounded-[22px] bg-coral-a text-2xl font-extrabold text-ink-950">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-xl font-extrabold">{displayName}</p>
            <p className="truncate text-xs text-ink-400">
              {isGuest ? "Бүртгэлгүй · энэ төхөөрөмж" : joined ? `${email} · ${joined}-с хойш` : email}
            </p>
            <span className="mt-2 inline-flex h-6 items-center gap-1 rounded-full bg-sun/15 px-2.5 text-xs font-extrabold text-sun">
              <BoltIcon className="size-3.5 fill-current" />
              {lvl.level}-р шат
            </span>
          </div>
        </div>
        <div className="relative flex flex-col gap-2">
          <div className="flex justify-between gap-3 text-xs font-bold">
            <span className="text-ink-400">{lvl.level + 1}-р шат хүртэл</span>
            <span className="tabular-nums">
              {fmtNum(stats.totalPoints - lvl.floor)} / {fmtNum(lvl.next - lvl.floor)} оноо
            </span>
          </div>
          <ProgressBar
            value={stats.totalPoints - lvl.floor}
            max={lvl.next - lvl.floor}
            label="Дараагийн шат хүртэл"
            track="bg-white/12"
            className="h-3"
          />
        </div>
      </section>

      {isGuest && <SignupCard className="xl:hidden" />}

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Хамгийн урт дараалал", value: `${stats.longestStreak} хоног`, Icon: FlameIcon, icon: "fill-coral-a text-coral-a" },
          { label: "Нийт оноо", value: fmtNum(stats.totalPoints), Icon: BoltIcon, icon: "fill-sun-icon text-sun-icon" },
          { label: "Нийт суралцсан", value: fmtDuration(stats.totalMinutes), Icon: ClockIcon, icon: "text-sky" },
          { label: "Идэвхтэй өдөр", value: `${activeDays}`, Icon: CalendarIcon, icon: "text-violet" },
        ].map(({ label, value, Icon, icon }) => (
          <div key={label} className="flex flex-col gap-2 rounded-[20px] bg-surface p-4">
            <Icon className={`size-6 ${icon}`} />
            <dd className="text-2xl font-extrabold leading-none tabular-nums">{value}</dd>
            <dt className="text-xs text-muted">{label}</dt>
          </div>
        ))}
      </dl>

      <section aria-labelledby="skills-h" className="rounded-[22px] bg-surface p-4 sm:p-5">
        <h2 id="skills-h" className="text-lg font-extrabold">
          Ур чадвараар
        </h2>
        <p className="text-xs text-muted">Нийт суралцсан хугацаанаас эзлэх хувь</p>
        <ul className="mt-4 flex flex-col gap-3.5">
          {SKILLS.map((s) => {
            const min = stats.moduleMinutes[s.id] ?? 0;
            const share = Math.round((min / totalMin) * 100);
            return (
              <li key={s.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between gap-3 text-[13px] font-bold">
                  <span>{s.name}</span>
                  <span className={`tabular-nums ${TONE[s.tone].text}`}>
                    {min > 0 ? `${fmtDuration(min)} · ${share}%` : "—"}
                  </span>
                </div>
                <ProgressBar
                  value={min}
                  max={totalMin}
                  label={`${s.name} — нийт хугацааны ${share}%`}
                  fill={TONE[s.tone].solid}
                  track={TONE[s.tone].soft}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="badges-h" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 id="badges-h" className="text-lg font-extrabold">
            Тэмдэг
          </h2>
          <span className="text-[13px] font-bold text-muted tabular-nums">
            {badges.filter((a) => a.earned).length} / {badges.length}
          </span>
        </div>
        <ul className="grid grid-cols-3 gap-3 lg:grid-cols-6">
          {badges.map((a) => {
            const Icon = BADGE_ICONS[a.icon];
            return (
              <li
                key={a.id}
                title={a.hint}
                className="flex flex-col items-center gap-2 rounded-[20px] bg-surface px-2 py-4 text-center"
              >
                <span
                  className={`grid size-14 place-items-center rounded-[18px] ${
                    a.earned
                      ? `press ${TONE[a.tone].solid} ${DEEP[a.tone]} text-ink-950`
                      : "bg-locked text-ink-400"
                  }`}
                >
                  {a.earned ? <Icon className="size-7 [stroke-width:2]" /> : <LockIcon className="size-6" />}
                </span>
                <p className={`text-xs font-bold ${a.earned ? "" : "text-muted"}`}>{a.title}</p>
                <p className="text-[11px] leading-tight text-muted">{a.hint}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="cal-h" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 id="cal-h" className="text-lg font-extrabold">
            Сүүлийн 5 долоо хоног
          </h2>
          <span className="text-[13px] font-bold text-muted tabular-nums">{activeDays} идэвхтэй өдөр</span>
        </div>
        <div className="rounded-[22px] bg-surface p-4 sm:p-5">
          <div className="mx-auto grid max-w-[360px] grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS_MON.map((w) => (
              <span key={w} className="pb-0.5 text-center text-[10px] font-bold text-muted">
                {w}
              </span>
            ))}
            {cells.map((c) => (
              <span
                key={c.key}
                title={c.future ? undefined : `${c.key}: ${c.points} оноо`}
                className={`aspect-square rounded-md ${
                  c.future ? "border border-dashed border-line" : HEAT[c.level]
                } ${c.today ? "ring-2 ring-coral-a ring-offset-2 ring-offset-surface" : ""}`}
              />
            ))}
          </div>
          <div className="mx-auto mt-4 flex max-w-[360px] items-center justify-end gap-1.5 text-[11px] text-muted">
            Бага
            {HEAT.map((h) => (
              <span key={h} className={`size-3 rounded-[3px] ${h}`} />
            ))}
            Их
          </div>
        </div>
      </section>
    </div>
  );
}
