import Link from "next/link";
import { SKILLS, getSkill, type SkillId } from "@/lib/skills";
import { TONE } from "@/lib/tones";
import { SkillIcon } from "@/components/skill-icon";
import { LogButton } from "@/components/game/widgets";
import { CheckIcon, ChevronRightIcon } from "@/components/icons";

/**
 * Placeholder shell for a skill page. Each skill route renders this until
 * its module ships; then the route swaps in real content.
 */
export function SkillPage({ id }: { id: SkillId }) {
  const skill = getSkill(id);
  const t = TONE[skill.tone];
  const others = SKILLS.filter((s) => s.id !== id);

  return (
    <div className="flex flex-col gap-4">
      <section className={`rounded-[28px] ${t.soft} p-5 sm:p-7`}>
        <div className="flex items-center gap-3">
          <span className={`grid size-14 place-items-center rounded-2xl bg-surface ${t.icon}`}>
            <SkillIcon id={id} className="size-7" />
          </span>
          <span className={`rounded-full bg-surface px-3 py-1 text-xs font-extrabold ${t.text}`}>
            Тун удахгүй
          </span>
        </div>
        <h1 className="mt-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] lg:text-4xl">
          {skill.name} <span className="font-semibold text-muted">· {skill.english}</span>
        </h1>
        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">{skill.tagline}</p>
        <LogButton module={id} className="mt-5">
          Дадлагын цагаа бүртгэх
        </LogButton>
      </section>

      <section className="rounded-3xl bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-extrabold">Юу хийх вэ</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {skill.planned.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px]">
              <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${t.soft} ${t.icon}`}>
                <CheckIcon className="size-4 [stroke-width:2.4]" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="others-h" className="mt-2">
        <h2 id="others-h" className="text-lg font-extrabold">
          Бусад ур чадвар
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {others.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="flex h-14 items-center gap-3 rounded-2xl bg-surface px-4 transition-transform hover:-translate-y-0.5"
              >
                <span className={`grid size-9 place-items-center rounded-xl ${TONE[s.tone].soft} ${TONE[s.tone].icon}`}>
                  <SkillIcon id={s.id} className="size-5" />
                </span>
                <span className="text-sm font-bold">{s.name}</span>
                <ChevronRightIcon className="ml-auto size-4 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
