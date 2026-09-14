import type { WeekDay } from "@/lib/tracker";
import { weekdayLabel } from "@/lib/game";
import { CheckIcon, FlameIcon } from "@/components/icons";

/** Last 7 days as check circles; today is the dashed one until it's done. */
export function WeekStrip({ week, dark = false }: { week: WeekDay[]; dark?: boolean }) {
  return (
    <ol className="grid grid-cols-7 gap-1.5">
      {week.map((d, i) => {
        const today = i === week.length - 1;
        const done = d.points > 0;
        const label = today
          ? dark
            ? "text-ink-100 font-extrabold"
            : "text-coral-a-text font-extrabold"
          : dark
            ? "text-ink-400"
            : "text-muted";
        const dot = done
          ? "bg-coral-a text-ink-950"
          : today
            ? "border-[3px] border-dashed border-coral-a text-coral-a"
            : dark
              ? "bg-white/8"
              : "bg-ink-400/15";
        return (
          <li key={d.day} className="flex flex-col items-center gap-1.5">
            <span className={`text-[11px] font-bold ${label}`}>{weekdayLabel(d.day)}</span>
            <span className={`grid size-9 place-items-center rounded-full ${dot}`}>
              {done ? (
                <CheckIcon className="size-[18px] [stroke-width:2.6]" />
              ) : today ? (
                <FlameIcon className="size-4 fill-current" />
              ) : null}
            </span>
            <span className="sr-only">{done ? "идэвхтэй" : "идэвхгүй"}</span>
          </li>
        );
      })}
    </ol>
  );
}
