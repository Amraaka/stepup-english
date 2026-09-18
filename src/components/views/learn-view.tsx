import Link from "next/link";
import type { LearnPlan, Track } from "@/lib/learn-tracks";
import { getSkill } from "@/lib/skills";
import { TONE } from "@/lib/tones";
import { SkillIcon } from "@/components/skill-icon";
import { ProgressBar } from "@/components/game/progress-bar";
import { ChevronRightIcon, TargetIcon } from "@/components/icons";

function TrackCard({ track }: { track: Track }) {
  const skill = getSkill(track.id);
  const t = TONE[skill.tone];
  const { progress, next, note } = track;

  return (
    <li className={`flex flex-col gap-4 rounded-[24px] ${t.soft} p-4 sm:p-5`}>
      <Link href={skill.href} className="group flex items-center gap-3">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-surface ${t.icon}`}>
          <SkillIcon id={skill.id} className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-extrabold leading-tight group-hover:underline">{skill.name}</span>
          <span className={`block text-xs font-semibold ${t.text}`}>{skill.english}</span>
        </span>
        {progress ? (
          <span className="shrink-0 text-right">
            <span className="block text-lg font-extrabold leading-none tabular-nums">
              {progress.done}
              <span className="text-sm text-muted">/{progress.total}</span>
            </span>
            <span className="text-[11px] font-bold text-muted">{progress.unit}</span>
          </span>
        ) : (
          !skill.live && (
            <span className={`shrink-0 rounded-full bg-surface px-2.5 py-1 text-[11px] font-extrabold ${t.text}`}>
              Тун удахгүй
            </span>
          )
        )}
      </Link>

      {progress && (
        <ProgressBar
          value={progress.done}
          max={progress.total}
          label={`${skill.name}: ${progress.done}/${progress.total} ${progress.unit}`}
          fill={t.solid}
          track="bg-surface"
          className="h-2"
        />
      )}

      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 transition-transform hover:-translate-y-0.5"
        >
          <span className="min-w-0 flex-1">
            <span className={`block text-[11px] font-extrabold ${t.text}`}>{next.label}</span>
            <span className="block truncate text-[15px] font-extrabold">{next.title}</span>
          </span>
          <span className={`grid size-9 shrink-0 place-items-center rounded-full ${t.solid} text-ink-950`}>
            <ChevronRightIcon className="size-5 [stroke-width:2.4]" />
          </span>
        </Link>
      ) : !skill.live ? (
        <p className="text-[13px] leading-relaxed text-muted text-pretty">{skill.tagline}</p>
      ) : null}

      {note && <p className="-mt-1 text-xs font-bold text-muted">{note}</p>}
    </li>
  );
}

export function LearnView({ plan }: { plan: LearnPlan }) {
  const levelLine = plan.isGuest
    ? "Нэвтэрвэл өөрийн түвшнээс эхэлж, ахиц тань хадгалагдана."
    : plan.level
      ? "Хичээл, эх, бичлэг таны сонгосон түвшнээс эхэлнэ."
      : "Түвшнээ сонгоогүй тул хамгийн эхнээс (A1) эхэлнэ.";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Суралцах</h1>

      <section className="flex items-center gap-3.5 rounded-[22px] bg-night p-4 text-ink-100 sm:p-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-coral-a text-ink-950">
          {plan.level ? (
            <span className="text-base font-extrabold">{plan.level}</span>
          ) : (
            <TargetIcon className="size-6 [stroke-width:2]" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold">
            {plan.level ? `Таны түвшин · ${plan.levelName}` : "Түвшин тодорхойгүй"}
          </p>
          <p className="text-xs leading-relaxed text-ink-400 text-pretty">
            {levelLine} Түвшин тогтоох шалгалт удахгүй нэмэгдэнэ.
          </p>
        </div>
        {plan.isGuest && (
          <Link
            href="/login"
            className="shrink-0 rounded-full bg-coral-a px-4 py-2.5 text-[13px] font-extrabold text-ink-950"
          >
            Нэвтрэх
          </Link>
        )}
      </section>

      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {plan.tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </ul>
    </div>
  );
}
