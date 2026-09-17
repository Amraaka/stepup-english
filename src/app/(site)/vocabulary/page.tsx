import type { Metadata } from "next";
import Link from "next/link";
import { getSkill } from "@/lib/skills";
import { TONE } from "@/lib/tones";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { boxLabel, DAILY_REVIEW_CAP } from "@/lib/vocab/review";
import { listSavedWords, reviewQueue } from "@/lib/vocab/words";
import { deleteWordAction } from "./actions";
import { SkillIcon } from "@/components/skill-icon";
import { XIcon } from "@/components/icons";

const skill = getSkill("vocabulary");
const t = TONE[skill.tone];

export const metadata: Metadata = {
  title: `${skill.name} · StepUp English`,
  description: skill.tagline,
};

function Hero({ children }: { children: React.ReactNode }) {
  return (
    <section className={`rounded-[28px] ${t.soft} p-5 sm:p-7`}>
      <span className={`grid size-14 place-items-center rounded-2xl bg-surface ${t.icon}`}>
        <SkillIcon id="vocabulary" className="size-7" />
      </span>
      <h1 className="mt-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] lg:text-4xl">
        {skill.name} <span className="font-semibold text-muted">· {skill.english}</span>
      </h1>
      {children}
    </section>
  );
}

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Hero>
        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">
          Бичлэг сонсохдоо ойлгоогүй үгээ хадгалаад, дараа нь давтаж цээжлээрэй. Үг хадгалахын тулд бүртгүүлэх хэрэгтэй.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/login" className="press inline-flex h-12 items-center rounded-2xl bg-coral-a px-5 text-sm font-extrabold text-ink-950">
            Нэвтрэх / бүртгүүлэх
          </Link>
          <Link href="/listening" className="inline-flex h-12 items-center rounded-2xl bg-surface px-5 text-sm font-extrabold">
            Бичлэг сонсох
          </Link>
        </div>
      </Hero>
    );
  }

  const profile = await getProfile(user.id);
  const [words, queue] = await Promise.all([
    listSavedWords(user.id),
    reviewQueue(user.id, profile?.timezone ?? "Asia/Ulaanbaatar"),
  ]);
  const today = queue.cards.length;

  return (
    <div className="flex flex-col gap-4">
      <Hero>
        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">
          {words.length === 0
            ? "Одоохондоо хадгалсан үг алга. Бичлэг сонсохдоо үг дээр дараад \"Хадгалах\" товчийг дараарай."
            : today > 0
              ? `Өнөөдөр давтах ${today} үг байна.`
              : queue.reviewedToday >= DAILY_REVIEW_CAP
                ? "Өнөөдрийн давталт дууссан. Маргааш дахиад давтаарай."
                : "Өнөөдөр давтах үг алга. Шинэ үг хадгалаад үзээрэй."}
        </p>
        {today > 0 ? (
          <Link
            href="/vocabulary/review"
            className={`press mt-5 inline-flex h-12 items-center rounded-2xl ${t.solid} px-5 text-sm font-extrabold text-ink-950 ${t.press}`}
          >
            Давтаж эхлэх ({today})
          </Link>
        ) : (
          <Link href="/listening" className="mt-5 inline-flex h-12 items-center rounded-2xl bg-surface px-5 text-sm font-extrabold">
            Бичлэг сонсох
          </Link>
        )}
      </Hero>

      {words.length > 0 && (
        <section aria-labelledby="words-h">
          <h2 id="words-h" className="text-lg font-extrabold">
            Хадгалсан үгс <span className="text-muted">· {words.length}</span>
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {words.map((w) => {
              const { entry } = w;
              return (
                <li key={w.id} className="flex items-center gap-3 rounded-2xl bg-surface py-3 pl-4 pr-2">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[15px] font-extrabold">{entry?.lemma ?? w.lemma}</span>
                      <span className="text-sm text-muted">{entry?.mn}</span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      <span className={`font-bold ${t.text}`}>{boxLabel(w.box)}</span>
                      {w.from && (
                        <>
                          {" · "}
                          <Link href={w.from.href} className="hover:underline">
                            {w.from.title}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                  <form action={deleteWordAction.bind(null, w.id)}>
                    <button
                      type="submit"
                      aria-label={`${w.lemma} үгийг устгах`}
                      className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-foreground"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
