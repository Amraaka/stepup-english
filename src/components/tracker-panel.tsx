import type { TrackerStats } from "@/lib/tracker";
import { FlameIcon, ClockIcon, StarIcon } from "@/components/icons";

const WEEKDAYS = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];

/** Presentational tracker — fed by DB stats (server) or browser stats (guest). */
export function TrackerPanel({
  stats,
  children,
}: {
  stats: TrackerStats;
  children?: React.ReactNode;
}) {
  const maxWeek = Math.max(...stats.week.map((d) => d.points), 1);

  return (
    <section className="overflow-hidden rounded-3xl bg-ink-900 text-ink-100 shadow-[0_16px_40px_-16px_rgb(18_18_21/0.35)]">
      <div className="flex items-end justify-between gap-4 p-5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FlameIcon className={stats.streak > 0 ? "text-coral-a" : "text-ink-400"} />
            <span className="text-5xl font-extrabold tabular-nums leading-none text-coral-a">
              {stats.streak}
            </span>
          </div>
          <p className="mt-2 text-sm text-ink-400">хоног дараалсан идэвх</p>
        </div>
        <dl className="flex gap-5 text-right">
          <div>
            <dt className="flex items-center justify-end gap-1 text-[11px] uppercase tracking-wide text-ink-400">
              <StarIcon className="h-3.5 w-3.5" /> оноо
            </dt>
            <dd className="mt-0.5 text-xl font-bold tabular-nums">{stats.totalPoints}</dd>
          </div>
          <div>
            <dt className="flex items-center justify-end gap-1 text-[11px] uppercase tracking-wide text-ink-400">
              <ClockIcon className="h-3.5 w-3.5" /> минут
            </dt>
            <dd className="mt-0.5 text-xl font-bold tabular-nums">{stats.totalMinutes}</dd>
          </div>
        </dl>
      </div>

      <div className="px-5">
        <div className="flex items-end justify-between gap-1.5">
          {stats.week.map((d, i) => {
            const h = Math.round((d.points / maxWeek) * 56);
            const dow = new Date(`${d.day}T12:00:00Z`).getUTCDay();
            const isToday = i === stats.week.length - 1;
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-14 w-full items-end">
                  <div
                    className={`w-full rounded-t-[5px] rounded-b-[2px] transition-[height] duration-300 ${
                      d.points > 0 ? "bg-coral-a" : "bg-ink-100/10"
                    }`}
                    style={{ height: `${Math.max(h, 5)}px` }}
                  />
                </div>
                <span
                  className={`text-[10.5px] ${isToday ? "font-bold text-ink-100" : "text-ink-400"}`}
                >
                  {WEEKDAYS[dow]}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 border-t border-ink-100/10 py-2.5 text-xs text-ink-400">
          Өнөөдөр: <span className="font-semibold text-ink-100">{stats.todayPoints} оноо</span>
          {stats.todayMinutes > 0 && <> · {stats.todayMinutes} мин</>}
        </p>
      </div>

      {children && <div className="border-t border-ink-100/10 bg-ink-950/40 p-5">{children}</div>}
    </section>
  );
}

export function LogFields({ modules }: { modules: [string, string][] }) {
  const field =
    "rounded-lg border border-ink-100/15 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-coral-a";
  return (
    <>
      <p className="mb-2.5 text-sm font-semibold text-ink-100">Өнөөдөр суусан цагаа бүртгэх</p>
      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <select name="module" className={`${field} w-full`} aria-label="Модуль">
          {modules.map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
        <select name="durationMin" defaultValue="15" className={`${field} w-full`} aria-label="Хугацаа">
          {[5, 10, 15, 20, 30, 45, 60].map((m) => (
            <option key={m} value={m}>
              {m} мин
            </option>
          ))}
        </select>
        <button className="col-span-2 rounded-lg bg-coral-a px-4 py-2.5 text-sm font-bold text-ink-950 transition-opacity hover:opacity-90 sm:col-span-1 sm:py-0">
          Бүртгэх
        </button>
      </div>
    </>
  );
}
