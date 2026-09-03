"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  buildStats,
  localDay,
  pointsForStudyLog,
  type DayAgg,
  type TrackerStats,
} from "@/lib/tracker";
import { TrackerPanel, LogFields } from "@/components/tracker-panel";

type GuestEvent = { day: string; durationMin: number; points: number };
const KEY = "stepup.guest.events.v1";
const TZ = "Asia/Ulaanbaatar";

const EMPTY: GuestEvent[] = [];
const listeners = new Set<() => void>();
let cache: GuestEvent[] | null = null;

function load(): GuestEvent[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

const store = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getSnapshot(): GuestEvent[] {
    if (cache === null) cache = load();
    return cache;
  },
  getServerSnapshot(): GuestEvent[] {
    return EMPTY;
  },
  add(e: GuestEvent) {
    cache = [...(cache ?? load()), e];
    try {
      localStorage.setItem(KEY, JSON.stringify(cache));
    } catch {
      /* private mode — keep in-memory only */
    }
    listeners.forEach((l) => l());
  },
};

function toStats(events: GuestEvent[]): TrackerStats {
  const byDay = new Map<string, DayAgg>();
  const totals: DayAgg = { points: 0, durationSec: 0 };
  for (const e of events) {
    const cur = byDay.get(e.day) ?? { points: 0, durationSec: 0 };
    cur.points += e.points;
    cur.durationSec += e.durationMin * 60;
    byDay.set(e.day, cur);
    totals.points += e.points;
    totals.durationSec += e.durationMin * 60;
  }
  return buildStats(byDay, localDay(new Date(), TZ), totals);
}

export function GuestTracker() {
  const events = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const stats = toStats(events);

  function logStudy(formData: FormData) {
    const durationMin = Math.max(0, Math.min(240, Number(formData.get("durationMin") ?? 0)));
    store.add({ day: localDay(new Date(), TZ), durationMin, points: pointsForStudyLog(durationMin) });
  }

  return (
    <div className="flex flex-col gap-3">
      <TrackerPanel stats={stats}>
        <form action={logStudy}>
          <LogFields modules={[["general", "Ерөнхий"]]} />
        </form>
      </TrackerPanel>
      <p className="rounded-xl border border-coral-a/30 bg-coral-a/8 px-4 py-3 text-[13px] leading-relaxed text-foreground">
        Түүх тань зөвхөн энэ төхөөрөмжид хадгалагдана.{" "}
        <Link href="/login?mode=signup" className="font-bold text-coral-a-text underline underline-offset-2">
          Бүртгүүлбэл
        </Link>{" "}
        хаанаас ч үргэлжлүүлж болно.
      </p>
    </div>
  );
}
