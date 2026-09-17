"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStats } from "@/components/stats-provider";
import type { Finished } from "@/app/(site)/reading/actions";
import { CheckIcon } from "@/components/icons";

/**
 * Saves a finished attempt once when it mounts and says whether the item now counts as finished
 * (ADR 0020). `save` returns null when the server rejected the attempt.
 */
export function CompletionNote({ save }: { save: () => Promise<Finished> }) {
  const { isGuest } = useStats();
  const [state, setState] = useState<"saving" | "passed" | "short" | "failed">("saving");
  const started = useRef(false);

  useEffect(() => {
    if (isGuest || started.current) return;
    started.current = true;
    save()
      .then((r) => setState(!r ? "failed" : r.passed ? "passed" : "short"))
      .catch(() => setState("failed"));
  }, [isGuest, save]);

  const base = "mt-4 flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-bold";
  if (isGuest) {
    return (
      <p className={`${base} bg-canvas text-muted`}>
        <Link href="/login" className="font-extrabold text-foreground underline">
          Нэвтэрвэл
        </Link>
        ахиц тань хадгалагдана
      </p>
    );
  }
  if (state === "saving") return <p className={`${base} bg-canvas text-muted`}>Хадгалж байна…</p>;
  if (state === "passed") {
    return (
      <p className={`${base} bg-mint-soft text-mint-text`}>
        <CheckIcon className="size-4 [stroke-width:2.6]" />
        Дууссан гэж тэмдэглэгдлээ
      </p>
    );
  }
  if (state === "short") {
    return <p className={`${base} bg-sun-soft text-sun-text`}>70%-иас дээш бол дууссанд тооцогдоно</p>;
  }
  return <p className={`${base} bg-coral-soft text-coral-a-text`}>Хадгалж чадсангүй. Дахин оролдоно уу.</p>;
}
