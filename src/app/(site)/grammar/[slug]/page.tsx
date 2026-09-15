import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVEL_NAME, getLesson, nextLesson } from "@/lib/grammar/lessons";
import { Timeline } from "@/components/grammar/timeline";
import { StudyTimer } from "@/components/grammar/study-timer";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, TargetIcon, XIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/grammar/[slug]">): Promise<Metadata> {
  const lesson = getLesson((await params).slug);
  return lesson ? { title: `${lesson.title} · Дүрэм · StepUp English`, description: lesson.summary } : {};
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-extrabold">{children}</h2>;
}

export default async function Page({ params }: PageProps<"/grammar/[slug]">) {
  const lesson = getLesson((await params).slug);
  if (!lesson) notFound();
  const next = nextLesson(lesson.slug);

  return (
    <div className="flex flex-col gap-4">
      <StudyTimer slug={lesson.slug} />

      <header>
        <Link
          href="/grammar"
          className="-ml-1 inline-flex items-center gap-0.5 text-sm font-bold text-rose-text hover:underline"
        >
          <ChevronLeftIcon className="size-4 [stroke-width:2.2]" />
          Дүрэм
        </Link>
        <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-[-0.02em] lg:text-[34px]">{lesson.title}</h1>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="rounded-full bg-rose-soft px-2.5 py-0.5 text-xs font-extrabold text-rose-text">
            {lesson.level} · {LEVEL_NAME[lesson.level]}
          </span>
          <span className="font-semibold">{lesson.mn}</span>
        </p>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed">{lesson.summary}</p>
      </header>

      <section className="rounded-[28px] bg-surface p-5 sm:p-6">
        <SectionTitle>Цагийн шугам</SectionTitle>
        <div className="mt-3">
          <Timeline marks={lesson.timeline.marks} caption={lesson.timeline.caption} />
        </div>
      </section>

      <section className="flex flex-col gap-2.5" aria-labelledby="uses-h">
        <h2 id="uses-h" className="text-lg font-extrabold">
          Хэзээ хэрэглэх вэ?
        </h2>
        {lesson.uses.map((u, i) => (
          <article key={u.title} className="rounded-3xl bg-surface p-5 sm:p-6">
            <h3 className="flex items-center gap-3 text-base font-extrabold">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-rose-soft text-sm text-rose-text">
                {i + 1}
              </span>
              {u.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{u.body}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {u.examples.map((e) => (
                <li key={e.en} className="rounded-2xl bg-canvas px-4 py-3">
                  <p lang="en" className="text-[16px] font-bold">
                    {e.en}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{e.mn}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] bg-surface p-5 sm:p-6">
        <SectionTitle>Хэлбэр</SectionTitle>
        <dl className="mt-3 flex flex-col divide-y divide-line">
          {lesson.form.map((f) => (
            <div key={f.label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[96px_1fr] sm:gap-4">
              <dt className="text-sm font-extrabold text-rose-text">{f.label}</dt>
              <dd>
                <p lang="en" className="font-mono text-[14px] font-semibold">
                  {f.pattern}
                </p>
                <p lang="en" className="mt-1 text-[15px] text-muted">
                  {f.example}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-[28px] bg-surface p-5 sm:p-6">
        <SectionTitle>Дохио үгс</SectionTitle>
        <p className="mt-1 text-sm text-muted">Эдгээр үг өгүүлбэрт байвал энэ цаг хэрэглэгдэх магадлал өндөр.</p>
        <ul className="mt-3 flex flex-wrap gap-2" lang="en">
          {lesson.signals.map((s) => (
            <li key={s} className="rounded-full bg-rose-soft px-3 py-1.5 text-sm font-bold text-rose-text">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[28px] bg-surface p-5 sm:p-6">
        <SectionTitle>Анхаарах алдаа</SectionTitle>
        <ul className="mt-3 flex flex-col gap-3">
          {lesson.pitfalls.map((p) => (
            <li key={p.wrong} className="rounded-2xl border border-line p-4">
              <p lang="en" className="flex items-start gap-2 text-[15px] text-coral-a-text">
                <XIcon className="mt-0.5 size-4 shrink-0" />
                <span className="line-through decoration-coral-a/50">{p.wrong}</span>
              </p>
              <p lang="en" className="mt-1.5 flex items-start gap-2 text-[15px] font-bold text-mint-text">
                <CheckIcon className="mt-0.5 size-4 shrink-0 [stroke-width:2.6]" />
                {p.right}
              </p>
              <p className="mt-2 text-sm text-muted">{p.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2.5 sm:flex-row">
        <Link
          href={`/grammar/${lesson.slug}/practice`}
          className="flex flex-1 items-center gap-4 rounded-3xl bg-rose-soft p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface text-rose">
            <TargetIcon className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold">Дасгал хийх</span>
            <span className="mt-0.5 block text-sm text-muted">{lesson.exercises.length} асуулт · 3 минут орчим</span>
          </span>
          <ChevronRightIcon className="size-5 shrink-0 text-muted" />
        </Link>
        {next && (
          <Link
            href={`/grammar/${next.slug}`}
            className="flex flex-1 items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-extrabold uppercase tracking-wide text-muted">Дараагийн хичээл</span>
              <span className="mt-0.5 block text-[15px] font-extrabold">{next.title}</span>
            </span>
            <ChevronRightIcon className="size-5 shrink-0 text-muted" />
          </Link>
        )}
      </section>
    </div>
  );
}
