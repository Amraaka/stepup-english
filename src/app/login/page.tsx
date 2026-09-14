"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";
import { signIn, signInWithGoogle, signUp, type AuthState } from "./actions";
import { Mascot } from "@/components/mascot";
import { ArrowRightIcon } from "@/components/icons";

const initial: AuthState = {};

const URL_ERRORS: Record<string, string> = {
  google: "Google-ээр нэвтрэх одоогоор боломжгүй байна. И-мэйлээр нэвтэрнэ үү.",
  callback: "Нэвтрэлт дуусаагүй. Дахин оролдоно уу.",
};

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin",
  );
  const [signInState, signInAction, signInPending] = useActionState(signIn, initial);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initial);
  // Controlled so React's automatic form reset after an action (e.g. a wrong
  // password) doesn't wipe what the learner typed. The password still clears.
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const state = mode === "signin" ? signInState : signUpState;
  const pending = mode === "signin" ? signInPending : signUpPending;
  const urlError = URL_ERRORS[params.get("error") ?? ""];

  const label = "text-sm font-bold";
  const input =
    "h-12 w-full rounded-xl border border-line bg-canvas px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-coral-a focus:bg-surface";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Mascot mood={mode === "signin" ? "happy" : "cheer"} className="size-24" />
          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.02em]">
            {mode === "signin" ? "Эргээд тавтай морил!" : "Өнөөдрөөс эхэлье"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {mode === "signin"
              ? "Нэвтэрч явцаа үргэлжлүүл."
              : "Үнэгүй бүртгүүлж явцаа хаанаас ч хадгал."}
          </p>
        </div>

        <div className="mt-6 rounded-[28px] bg-surface p-5 sm:p-6">
          <div role="tablist" aria-label="Нэвтрэх эсвэл бүртгүүлэх" className="grid grid-cols-2 rounded-2xl bg-canvas p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className="h-11 rounded-xl text-sm font-bold text-muted transition-colors aria-selected:bg-surface aria-selected:font-extrabold aria-selected:text-foreground aria-selected:shadow-[0_2px_8px_-2px_rgb(18_18_21/0.15)]"
              >
                {m === "signin" ? "Нэвтрэх" : "Бүртгүүлэх"}
              </button>
            ))}
          </div>

          <form action={signInWithGoogle} className="mt-5">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-surface text-[15px] font-bold transition-colors hover:bg-canvas"
            >
              <GoogleMark />
              Google-ээр {mode === "signin" ? "нэвтрэх" : "бүртгүүлэх"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-bold text-muted">
            <span className="h-px flex-1 bg-line" />
            эсвэл и-мэйлээр
            <span className="h-px flex-1 bg-line" />
          </div>

          {state.notice ? (
            <div role="status" className="flex flex-col items-center gap-2 rounded-2xl bg-mint-soft px-4 py-5 text-center">
              <p className="text-[15px] font-extrabold text-mint-text">И-мэйлээ шалгана уу</p>
              <p className="text-sm text-foreground">{state.notice}</p>
            </div>
          ) : (
            <form action={mode === "signin" ? signInAction : signUpAction} className="flex flex-col gap-4">
              {mode === "signup" && (
                <label className="flex flex-col gap-1.5">
                  <span className={label}>Нэр</span>
                  <input
                    name="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    maxLength={60}
                    placeholder="Жишээ нь: Тэмүүлэн"
                    autoComplete="name"
                    className={input}
                  />
                </label>
              )}
              <label className="flex flex-col gap-1.5">
                <span className={label}>И-мэйл</span>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  autoComplete="email"
                  className={input}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={label}>Нууц үг</span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="6-аас дээш тэмдэгт"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className={input}
                />
              </label>
              {(state.error || urlError) && (
                <p role="alert" className="rounded-xl bg-coral-soft px-3.5 py-2.5 text-sm font-semibold text-coral-a-text">
                  {state.error ?? urlError}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="press mt-1 h-14 rounded-2xl bg-coral-a text-base font-extrabold text-ink-950 disabled:opacity-60"
              >
                {pending ? "Түр хүлээнэ үү…" : mode === "signin" ? "Нэвтрэх" : "Бүртгүүлэх"}
              </button>
            </form>
          )}
        </div>

        <Link
          href="/"
          className="mx-auto mt-5 flex h-11 w-fit items-center gap-1.5 rounded-full px-4 text-sm font-bold text-muted transition-colors hover:text-foreground"
        >
          Бүртгэлгүй үргэлжлүүлэх <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
