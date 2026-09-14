"use client";

import { useStats } from "@/components/stats-provider";
import { fmtNum, weekPoints } from "@/lib/game";
import { ArrowUpIcon, BoltIcon, CheckIcon, ShieldCheckIcon } from "@/components/icons";

const TIERS = [
  { name: "Хүрэл", outer: "#C47A4E", inner: "#DE9A70" },
  { name: "Мөнгөн", outer: "#8E9AAD", inner: "#C9D2DE" },
  { name: "Алтан", outer: "#D98E00", inner: "#F5B233" },
  { name: "Сапфир", outer: "#1D5FC0", inner: "#2F7FF0" },
  { name: "Алмаз", outer: "#5A3EE0", inner: "#7B5CFA" },
];

function TierBadge({ outer, inner, size }: { outer: string; inner: string; size: string }) {
  return (
    <svg viewBox="0 0 40 46" className={size} aria-hidden>
      <path d="M20 2 37 9v13c0 11-7.5 18.5-17 22C10.5 40.5 3 33 3 22V9l17-7Z" fill={outer} />
      <path d="M20 8 31 12.5v9c0 7-4.8 12-11 14.5-6.2-2.5-11-7.5-11-14.5v-9L20 8Z" fill={inner} />
    </svg>
  );
}

const RULES = [
  { Icon: BoltIcon, text: "7 хоногийн турш суралцаж оноо цуглуулна" },
  { Icon: ArrowUpIcon, text: "Эхний 5 нь дараагийн лиг рүү дээшилнэ — доош унах бүс байхгүй" },
  { Icon: CheckIcon, text: "Оролцох эсэхээ өөрөө сонгоно" },
];

export function LeagueView() {
  const { stats } = useStats();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Лиг</h1>

      <section className="flex flex-col items-center gap-4 rounded-[28px] bg-night px-5 pb-6 pt-7 text-center text-ink-100">
        <div className="flex items-end justify-center gap-3">
          {TIERS.map((t, i) => (
            <TierBadge
              key={t.name}
              outer={t.outer}
              inner={t.inner}
              size={i === 1 ? "h-[74px] w-16 drop-shadow-[0_0_18px_rgb(201_210_222/0.5)]" : "h-[46px] w-10 opacity-40"}
            />
          ))}
        </div>
        <div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-extrabold text-ink-100">
            Тун удахгүй
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em]">7 хоногийн лиг</h2>
          <p className="mx-auto mt-1.5 max-w-[36ch] text-sm leading-relaxed text-ink-400">
            Ижил идэвхтэй суралцагчидтай нэг бүлэгт орж, найрсаг уралдана.
          </p>
        </div>
      </section>

      <section className="flex items-center gap-3.5 rounded-3xl bg-surface p-4">
        <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(160deg,#c9d2de,#8e9aad)] text-white">
          <ShieldCheckIcon className="size-7 [stroke-width:2]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">Энэ 7 хоногт цуглуулсан оноо</p>
          <p className="text-2xl font-extrabold tabular-nums">{fmtNum(weekPoints(stats))}</p>
        </div>
      </section>

      <section aria-labelledby="rules-h" className="rounded-3xl bg-surface p-4">
        <h2 id="rules-h" className="text-[15px] font-extrabold">
          Хэрхэн ажиллах вэ
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {RULES.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-canvas text-coral-a-text">
                <Icon className="size-5" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
