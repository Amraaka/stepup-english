"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Plays one time range of a clip and stops at its end (checked every frame). */
export function useSentenceAudio(src: string) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const stopAt = useRef(Infinity);
  const unlocked = useRef(false);
  const playCount = useRef(0);
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
    playCount.current += 1;
    a.pause();
    a.muted = false;
    a.currentTime = start;
    stopAt.current = end + 0.15;
    a.playbackRate = rate;
    a.play().catch(() => setPlaying(false));
  }, []);

  /**
   * Call inside a tap handler before a play that happens later in an effect: iOS Safari only lets an
   * element play from code after it has played once during a user gesture.
   */
  const prime = useCallback(() => {
    const a = audio.current;
    if (!a || unlocked.current) return;
    unlocked.current = true;
    const count = playCount.current;
    a.muted = true;
    a.play()
      .then(() => {
        // A real play started meanwhile; leave it running.
        if (playCount.current !== count) return;
        a.pause();
        a.muted = false;
      })
      .catch(() => {
        a.muted = false;
        unlocked.current = false;
      });
  }, []);

  const stop = useCallback(() => audio.current?.pause(), []);

  return { playing, playRange, stop, prime };
}
