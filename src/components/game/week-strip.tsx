import type { WeekDay } from "@/lib/tracker";
import { calendarWeek, weekdayLabel } from "@/lib/game";
import { CheckIcon, FlameIcon } from "@/components/icons";

/** The current Monday–Sunday week as check circles; today is dashed until it's done, later days are faint. */
export function WeekStrip({ days, dark = false }: { days: WeekDay[]; dark?: boolean }) {
  return (
    <ol className="grid grid-cols-7 gap-1.5">
      {calendarWeek(days).map((d) => {
        const done = d.points > 0;
        const label = d.today
          ? dark
            ? "text-ink-100 font-extrabold"
            : "text-coral-a-text font-extrabold"
          : dark
            ? "text-ink-400"
            : "text-muted";
        const dot = done
          ? "bg-coral-a text-ink-950"
          : d.today
            ? "border-[3px] border-dashed border-coral-a text-coral-a"
            : d.future
              ? dark
                ? "border-2 border-white/10"
                : "border-2 border-ink-400/20"
              : dark
                ? "bg-white/8"
                : "bg-ink-400/15";
        return (
          <li key={d.day} className="flex flex-col items-center gap-1.5">
            <span className={`text-[11px] font-bold ${label}`}>{weekdayLabel(d.day)}</span>
            <span className={`grid size-9 place-items-center rounded-full ${dot}`}>
              {done ? (
                <CheckIcon className="size-[18px] [stroke-width:2.6]" />
              ) : d.today ? (
                <FlameIcon className="size-4 fill-current" />
              ) : null}
            </span>
            <span className="sr-only">{done ? "идэвхтэй" : d.future ? "ирэх өдөр" : "идэвхгүй"}</span>
          </li>
        );
      })}
    </ol>
  );
}
