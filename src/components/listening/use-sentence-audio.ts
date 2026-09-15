"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Plays one time range of a clip and stops at its end (checked every frame). */
export function useSentenceAudio(src: string) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const stopAt = useRef(Infinity);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;
    const a = new Audio(src);
    a.preload = "auto";
    audio.current = a;
    let raf = 0;
    const watch = () => {
      if (a.currentTime >= stopAt.current) {
        a.pause();
        return;
      }
      raf = requestAnimationFrame(watch);
    };
    const onPlay = () => {
      setPlaying(true);
      raf = requestAnimationFrame(watch);
    };
    const onStop = () => {
      setPlaying(false);
      cancelAnimationFrame(raf);
    };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onStop);
    a.addEventListener("ended", onStop);
    return () => {
      cancelAnimationFrame(raf);
      a.pause();
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onStop);
      a.removeEventListener("ended", onStop);
      audio.current = null;
    };
  }, [src]);

  const playRange = useCallback((start: number, end: number, rate = 1) => {
    const a = audio.current;
    if (!a) return;
    a.pause();
    a.currentTime = start;
    stopAt.current = end + 0.15;
    a.playbackRate = rate;
    a.play().catch(() => setPlaying(false));
  }, []);

  const stop = useCallback(() => audio.current?.pause(), []);

  return { playing, playRange, stop };
}
