"use client";

import { useCallback, useEffect, useRef } from "react";
import { MIN_TIMED_SEC, type TimedTarget } from "@/lib/tracker";
import { useStats } from "@/components/stats-provider";

/**
 * Measures study time for a module and logs it to the tracker (ADR 0009/0010).
 * A second counts only while the tab is visible and `counting()` is true.
 * Time is flushed on tab hide, on unmount and every `flushEverySec`; call the
 * returned `flush(true)` when a session finishes to show the celebration.
 */
export function useMeasuredTime(
  target: TimedTarget,
  opts: { counting: () => boolean; maxSec?: number; flushEverySec?: number },
) {
  const { logTimed } = useStats();
  const logRef = useRef(logTimed);
  const countingRef = useRef(opts.counting);
  useEffect(() => {
    logRef.current = logTimed;
    countingRef.current = opts.counting;
  });

  const pending = useRef(0);
  const counted = useRef(0);
  const { module, ref } = target;

  const flush = useCallback(
    (celebrate: boolean) => {
      const seconds = pending.current;
      if (seconds < MIN_TIMED_SEC) return;
      pending.current = 0;
      logRef.current({ module, ref } as TimedTarget, seconds, celebrate);
    },
    [module, ref],
  );

  const maxSec = opts.maxSec ?? Infinity;
  const flushEverySec = opts.flushEverySec ?? 300;

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible" || !countingRef.current()) return;
      if (counted.current >= maxSec) return;
      pending.current += 1;
      counted.current += 1;
      if (pending.current >= flushEverySec) flush(false);
    }, 1000);
    const onVisibility = () => document.visibilityState === "hidden" && flush(false);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisibility);
      flush(false);
    };
  }, [flush, maxSec, flushEverySec]);

  return flush;
}
