"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "./actions";

const initial: AuthState = {};

function LoginForm() {
  const params = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin",
  );
  const [signInState, signInAction, signInPending] = useActionState(signIn, initial);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initial);
  const state = mode === "signin" ? signInState : signUpState;
  const pending = mode === "signin" ? signInPending : signUpPending;

  const input =
    "w-full rounded-lg border border-ink-400/40 bg-background px-3 py-2.5 text-foreground outline-none focus:border-coral-a";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" className="h-16 w-16" />
        <h1 className="text-2xl font-bold">StepUp English</h1>
      </div>

      <div className="grid grid-cols-2 rounded-lg bg-ink-50 p-1 text-sm font-medium dark:bg-ink-900">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-md py-2 transition-colors ${
              mode === m ? "bg-background shadow-sm" : "text-muted"
            }`}
          >
            {m === "signin" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </button>
        ))}
      </div>

      <form action={mode === "signin" ? signInAction : signUpAction} className="flex flex-col gap-3">
        {mode === "signup" && (
          <input name="displayName" placeholder="Нэр" autoComplete="name" className={input} />
        )}
        <input
          name="email"
          type="email"
          required
          placeholder="И-мэйл"
          autoComplete="email"
          className={input}
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Нууц үг (6+ тэмдэгт)"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          className={input}
        />
        {state.error && <p className="text-sm text-coral-a-text">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-coral-a py-3 text-base font-bold text-ink-950 disabled:opacity-60"
        >
          {pending ? "Түр хүлээнэ үү…" : mode === "signin" ? "Нэвтрэх" : "Бүртгүүлэх"}
        </button>
      </form>
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
