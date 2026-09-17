"use client";

import { useCallback, useEffect, useRef } from "react";
import { MIN_TIMED_SEC, type TimedTarget } from "@/lib/tracker";
import { useStats } from "@/components/stats-provider";

/**
 * Measures study time for a module and logs it to the tracker (ADR 0009/0010).
 * A second counts only while the tab is visible and `counting()` is true.
 * Time is flushed on unmount and every `flushEverySec` through the server action; call the
 * returned `flush(true)` when a session finishes to show the celebration. When the tab is hidden
 * or the page is closed, it goes out as a beacon, so a refresh or closed tab keeps it (ADR 0015).
 */
export function useMeasuredTime(
  target: TimedTarget,
  opts: { counting: () => boolean; maxSec?: number; flushEverySec?: number },
) {
  const { logTimed, beaconTimed } = useStats();
  const logRef = useRef(logTimed);
  const beaconRef = useRef(beaconTimed);
  const countingRef = useRef(opts.counting);
  useEffect(() => {
    logRef.current = logTimed;
    beaconRef.current = beaconTimed;
    countingRef.current = opts.counting;
  });

  const pending = useRef(0);
  const counted = useRef(0);
  const { module, ref } = target;

  const flush = useCallback(
    (celebrate: boolean, leaving = false) => {
      const seconds = pending.current;
      if (seconds < MIN_TIMED_SEC) return;
      pending.current = 0;
      const target = { module, ref } as TimedTarget;
      if (leaving) beaconRef.current(target, seconds);
      else logRef.current(target, seconds, celebrate);
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
    // Hidden or closed: the page may be unloading, so send a beacon. The first event empties
    // `pending`, so a later `pagehide` or unmount doesn't send the same seconds again.
    const onVisibility = () => document.visibilityState === "hidden" && flush(false, true);
    const onPageHide = () => flush(false, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      flush(false);
    };
  }, [flush, maxSec, flushEverySec]);

  return flush;
}
