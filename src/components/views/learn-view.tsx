"use client";

import Link from "next/link";
import { useStats } from "@/components/stats-provider";
import { SKILLS } from "@/lib/skills";
import { TONE } from "@/lib/tones";
import { Mascot } from "@/components/mascot";
import { SkillIcon } from "@/components/skill-icon";
import { BookIcon, CheckIcon, GiftIcon, LockIcon, PlusIcon, TargetIcon } from "@/components/icons";

// Zigzag offsets (px) for the path nodes, top to bottom.
const OFFSETS = [0, -70, -96, -40, 44, 72, 40, -30];

export function LearnView() {
  const { stats, openLog } = useStats();
  const doneToday = stats.todayPoints > 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Суралцах зам</h1>

      <section className="flex items-center gap-3.5 rounded-[22px] bg-night p-4 text-ink-100">
        <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-coral-a text-ink-950">
          <TargetIcon className="size-6 [stroke-width:2]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold">Түвшин тогтоох шалгалт</p>
          <p className="text-xs text-ink-400 text-pretty">
            Тун удахгүй — дараа нь түвшиндээ тохирсон замаар явна
          </p>
        </div>
      </section>

      <nav
        aria-label="Ур чадвар"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,black_82%,transparent)] [scrollbar-width:none] sm:mx-0 sm:px-0 sm:[mask-image:none]"
      >
        {SKILLS.map((s) => (
          <Link
            key={s.id}
            href={s.href}
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-surface px-4 text-sm font-bold transition-colors hover:bg-surface/70"
          >
            <span className={`size-2 rounded-full ${TONE[s.tone].solid}`} />
            {s.name}
          </Link>
        ))}
      </nav>

      <section className="press flex items-center gap-3 rounded-[22px] bg-coral-a px-5 py-4 text-ink-950">
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-extrabold tracking-[-0.01em] text-balance sm:text-[19px]">
            1-р бүлэг · Өдөр тутмын яриа
          </h2>
          <p className="text-[13px] font-semibold text-ink-950/70">Мэндлэх, захиалах, асуух</p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-ink-950/12">
          <BookIcon className="size-6" />
        </span>
      </section>

      <ol className="mx-auto flex w-full max-w-sm flex-col items-center gap-9 py-8">
        <li className="relative flex flex-col items-center" style={{ transform: `translateX(${OFFSETS[0]}px)` }}>
          <span className="mb-2 rounded-xl bg-surface px-3.5 py-2 text-sm font-extrabold text-coral-a-text shadow-[0_8px_20px_-10px_rgb(18_18_21/0.3)]">
            {doneToday ? "Өнөөдөр биелсэн" : "Эхлэх"}
          </span>
          <span className="grid size-[104px] place-items-center rounded-full bg-coral-a/18">
            <button
              type="button"
              onClick={() => openLog()}
              aria-label="Өнөөдрийн бүртгэл хийх"
              className={`press grid size-21 place-items-center rounded-full ${
                doneToday ? "bg-mint text-white [--press:var(--mint-deep)]" : "bg-coral-a text-ink-950"
              }`}
            >
              {doneToday ? (
                <CheckIcon className="size-9 [stroke-width:2.6]" />
              ) : (
                <PlusIcon className="size-9 [stroke-width:2.4]" />
              )}
            </button>
          </span>
          <p className="mt-2.5 text-[13px] font-extrabold">Өдрийн бүртгэл</p>
          <Mascot mood="think" className="absolute -right-30 top-14 size-24 sm:-right-36 sm:size-28" />
        </li>

        {SKILLS.map((s, i) => (
          <li
            key={s.id}
            className="flex flex-col items-center"
            style={{ transform: `translateX(${OFFSETS[i + 1]}px)` }}
          >
            <span className="press grid size-18 place-items-center rounded-full bg-locked text-ink-400 [--press:var(--locked-deep)]">
              <SkillIcon id={s.id} className="size-7" />
            </span>
            <p className="mt-2.5 text-xs font-bold text-muted">{s.name} · тун удахгүй</p>
          </li>
        ))}

        <li className="flex flex-col items-center" style={{ transform: `translateX(${OFFSETS[SKILLS.length + 1]}px)` }}>
          <span className="press grid size-20 place-items-center rounded-[22px] bg-sun text-ink-950 [--press:var(--sun-deep)]">
            <GiftIcon className="size-9" />
          </span>
          <p className="mt-2.5 text-xs font-bold text-sun-text">Бүлгийн шагнал</p>
        </li>
      </ol>

      <div className="flex items-center gap-3">
        <span className="h-0.5 flex-1 bg-locked" />
        <span className="flex items-center gap-1.5 text-[13px] font-extrabold text-muted">
          <LockIcon className="size-4" />
          2-р бүлэг · Аялал
        </span>
        <span className="h-0.5 flex-1 bg-locked" />
      </div>
      <p className="text-center text-xs text-muted">Хичээлүүд бэлэн болмогц энд нээгдэнэ.</p>
    </div>
  );
}
