"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import { completeOnboarding, type OnboardingState } from "./actions";
import { GUEST_EVENTS_KEY } from "@/lib/guest";
import { Mascot } from "@/components/mascot";
import { CheckIcon } from "@/components/icons";

const LEVELS = [
  { id: "beginner", title: "Эхлэгч", hint: "Бараг мэдэхгүй, эхнээс нь эхэлнэ" },
  { id: "elementary", title: "Бага", hint: "Энгийн өгүүлбэр ойлгоно" },
  { id: "intermediate", title: "Дунд", hint: "Өдөр тутмын ярианд оролцож чадна" },
  { id: "advanced", title: "Ахисан", hint: "Чөлөөтэй уншиж, ярьж чадна" },
  { id: "unsure", title: "Мэдэхгүй байна", hint: "Түвшин тогтоох шалгалт удахгүй" },
];

const GOALS = [
  { id: "school", title: "Сургууль" },
  { id: "work", title: "Ажил" },
  { id: "exam", title: "Шалгалт (IELTS гэх мэт)" },
  { id: "travel", title: "Аялал" },
  { id: "self", title: "Өөрийгөө хөгжүүлэх" },
];

const initial: OnboardingState = {};

function readGuestEvents(): string {
  try {
    return localStorage.getItem(GUEST_EVENTS_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function OnboardingForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(completeOnboarding, initial);
  const [level, setLevel] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [importGuest, setImportGuest] = useState(true);
  // Controlled: survives React's form reset if the server rejects the submit.
  const [displayName, setDisplayName] = useState("");
  const guestEvents = useSyncExternalStore(
    () => () => {},
    readGuestEvents,
    () => "[]",
  );
  const guestCount = (() => {
    try {
      const v = JSON.parse(guestEvents);
      return Array.isArray(v) ? v.length : 0;
    } catch {
      return 0;
    }
  })();

  const needsName = name.trim() === "";
  const ready = level !== "" && goals.length > 0;

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-10">
      <form
        action={action}
        onSubmit={() => {
          // The server imports the history in this same request; clear the local copy.
          if (importGuest && guestCount > 0) {
            try {
              localStorage.removeItem(GUEST_EVENTS_KEY);
            } catch {
              /* private mode */
            }
          }
        }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center">
          <Mascot mood="cheer" className="size-24" />
          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-balance">
            {needsName ? "Танилцъя!" : `Тавтай морил, ${name.split(" ")[0]}!`}
          </h1>
          <p className="mt-1 text-sm text-muted">Хоёр асуулт — замаа танд тохируулахад тусална.</p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {needsName && (
            <section className="rounded-[24px] bg-surface p-5">
              <label className="flex flex-col gap-2">
                <span className="text-[15px] font-extrabold">Таныг хэн гэж дуудах вэ?</span>
                <input
                  name="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  maxLength={60}
                  autoComplete="name"
                  placeholder="Жишээ нь: Тэмүүлэн"
                  className="h-12 w-full rounded-xl border border-line bg-canvas px-3.5 text-[15px] outline-none transition-colors focus:border-coral-a focus:bg-surface"
                />
              </label>
            </section>
          )}

          <fieldset className="rounded-[24px] bg-surface p-5">
            <legend className="float-left mb-3 w-full text-[15px] font-extrabold">
              Англи хэлний түвшин тань?
            </legend>
            <div className="clear-left flex flex-col gap-2">
              {LEVELS.map((l) => (
                <label
                  key={l.id}
                  className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 border-transparent bg-canvas px-4 py-2.5 transition-colors has-checked:border-coral-a has-checked:bg-coral-soft"
                >
                  <input
                    type="radio"
                    name="level"
                    value={l.id}
                    required
                    checked={level === l.id}
                    onChange={() => setLevel(l.id)}
                    className="sr-only"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold">{l.title}</span>
                    <span className="block text-xs text-muted">{l.hint}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`grid size-6 shrink-0 place-items-center rounded-full border-2 ${
                      level === l.id ? "border-coral-a bg-coral-a text-ink-950" : "border-ink-400/40"
                    }`}
                  >
                    {level === l.id && <CheckIcon className="size-4 [stroke-width:2.8]" />}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-[24px] bg-surface p-5">
            <legend className="float-left w-full text-[15px] font-extrabold">Юуны төлөө суралцаж байна?</legend>
            <p className="clear-left mb-3 text-xs text-muted">Хэд хэдийг сонгож болно.</p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => {
                const on = goals.includes(g.id);
                return (
                  <label
                    key={g.id}
                    className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-canvas px-4 text-sm font-bold transition-colors has-checked:bg-ink-900 has-checked:text-ink-100 dark:has-checked:bg-ink-100 dark:has-checked:text-ink-950"
                  >
                    <input
                      type="checkbox"
                      name="goals"
                      value={g.id}
                      checked={on}
                      onChange={() => setGoals((cur) => (on ? cur.filter((x) => x !== g.id) : [...cur, g.id]))}
                      className="sr-only"
                    />
                    {on && <CheckIcon className="size-4 [stroke-width:2.6]" />}
                    {g.title}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {guestCount > 0 && (
            <label className="flex cursor-pointer items-start gap-3 rounded-[24px] bg-sun-soft p-4">
              <input
                type="checkbox"
                checked={importGuest}
                onChange={(e) => setImportGuest(e.target.checked)}
                className="mt-0.5 size-5 accent-[var(--coral-a)]"
              />
              <span className="text-sm">
                <b className="text-sun-text">Бүртгэлгүй үеийн {guestCount} бүртгэлээ шилжүүлэх</b>
                <span className="block text-xs text-muted">Энэ төхөөрөмж дээр хийсэн streak, оноо тань алга болохгүй.</span>
              </span>
            </label>
          )}
          <input type="hidden" name="guestEvents" value={importGuest ? guestEvents : "[]"} />

          {state.error && (
            <p role="alert" className="rounded-xl bg-coral-soft px-3.5 py-2.5 text-sm font-semibold text-coral-a-text">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !ready}
            className="press h-14 rounded-2xl bg-coral-a text-base font-extrabold text-ink-950 disabled:opacity-50"
          >
            {pending ? "Хадгалж байна…" : "Эхлэх"}
          </button>
        </div>
      </form>
    </main>
  );
}
