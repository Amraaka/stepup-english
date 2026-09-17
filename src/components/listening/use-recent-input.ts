"use client";

import { useCallback, useEffect, useRef } from "react";

/** True while the learner tapped, typed or scrolled within `windowMs`, so an idle open tab stops counting time. */
export function useRecentInput(windowMs = 120_000) {
  const last = useRef(0);

  useEffect(() => {
    last.current = Date.now();
    const mark = () => {
      last.current = Date.now();
    };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, mark));
  }, []);

  return useCallback(() => Date.now() - last.current < windowMs, [windowMs]);
}
