"use client";

import { useStats } from "@/components/stats-provider";
import { dailyQuests, weeklyQuests } from "@/lib/game";
import { Mascot } from "@/components/mascot";
import { ProgressBar } from "@/components/game/progress-bar";
import { QuestRows } from "@/components/game/widgets";
import { MedalIcon } from "@/components/icons";

export function QuestsView() {
  const { stats } = useStats();
  const daily = dailyQuests(stats);
  const weekly = weeklyQuests(stats);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Даалгавар</h1>

      <section aria-labelledby="daily-h" className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <h2 id="daily-h" className="text-lg font-extrabold">
            Өдөр тутам
          </h2>
          <span className="text-xs font-bold text-muted">Шөнө 00:00-д шинэчлэгдэнэ</span>
        </div>
        <div className="rounded-3xl bg-surface px-4 py-1">
          <QuestRows quests={daily} />
        </div>
      </section>

      <section aria-labelledby="weekly-h" className="mt-2 flex flex-col gap-2.5">
        <h2 id="weekly-h" className="text-lg font-extrabold">
          Энэ 7 хоног
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {weekly.map((q) => (
            <div key={q.id} className="flex flex-col gap-2.5 rounded-[22px] bg-night p-4 text-ink-100">
              <p className="text-[13px] font-bold text-ink-400">{q.title}</p>
              <p className="text-3xl font-extrabold leading-none tabular-nums">
                {Math.min(q.value, q.target)}
                <span className="text-base text-ink-400"> / {q.target}</span>
              </p>
              <ProgressBar
                value={q.value}
                max={q.target}
                label={q.title}
                fill={q.value >= q.target ? "bg-mint" : "bg-coral-a"}
                track="bg-white/12"
                className="h-2"
              />
              <p className="text-xs font-bold text-ink-400">{q.value >= q.target ? "Биелсэн!" : q.unit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mt-2 flex flex-col gap-3 overflow-hidden rounded-[28px] bg-sun-soft p-5">
        <Mascot mood="cheer" className="absolute -right-3 -top-1 size-28 opacity-90" />
        <span className="w-fit rounded-full bg-surface px-2.5 py-1 text-[11px] font-extrabold text-sun-text">
          Тун удахгүй
        </span>
        <h2 className="max-w-[14ch] text-2xl font-extrabold leading-tight tracking-[-0.02em]">
          30 өдрийн дүрмийн сорил
        </h2>
        <div className="flex items-center gap-2.5 rounded-2xl bg-surface/70 px-3 py-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sun text-ink-950">
            <MedalIcon className="size-5" />
          </span>
          <p className="text-[13px] font-semibold leading-snug">
            Сар бүр нэг том сорил. Дуусгавал профайлдаа тусгай тэмдэг авна.
          </p>
        </div>
      </section>
    </div>
  );
}
