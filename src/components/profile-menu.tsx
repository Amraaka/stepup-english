"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/login/actions";

export function ProfileMenu({
  name,
  email,
  placement = "down",
}: {
  name: string;
  email: string;
  placement?: "down" | "up";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const initial = (name || email).trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Профайл цэс"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-ink-100 ring-coral-a transition-shadow hover:ring-2 dark:bg-ink-100 dark:text-ink-950"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 w-56 overflow-hidden rounded-xl border border-line bg-surface shadow-lg shadow-ink-950/10 ${
            placement === "up" ? "bottom-12 left-0" : "right-0 top-11"
          }`}
        >
          <div className="border-b border-ink-400/15 px-4 py-3">
            <p className="truncate text-sm font-bold">{name || "Сурагч"}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <form action={signOut}>
            <button
              role="menuitem"
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-coral-a-text transition-colors hover:bg-ink-50 dark:hover:bg-ink-900"
            >
              Гарах
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
