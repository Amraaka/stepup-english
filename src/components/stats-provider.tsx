"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import {
  MIN_TIMED_SEC,
  buildStats,
  localDay,
  pointsForStudyLog,
  type DayAgg,
  type TimedTarget,
  type TrackerStats,
} from "@/lib/tracker";
import { logStudyAction, logTimedAction } from "@/app/(site)/actions";
import { GUEST_EVENTS_KEY } from "@/lib/guest";
import { LogSheet } from "@/components/game/log-sheet";
import { Celebration, type CelebrationData } from "@/components/game/celebration";

// Guest mode: events live in this browser only.
type GuestEvent = { day: string; durationMin: number; points: number; module?: string; ref?: string };
const KEY = GUEST_EVENTS_KEY;
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

const guestStore = {
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

function guestStats(events: GuestEvent[]): TrackerStats {
  const byDay = new Map<string, DayAgg>();
  const totals: DayAgg = { points: 0, durationSec: 0 };
  const moduleMinutes: Record<string, number> = {};
  for (const e of events) {
    const cur = byDay.get(e.day) ?? { points: 0, durationSec: 0 };
    cur.points += e.points;
    cur.durationSec += e.durationMin * 60;
    byDay.set(e.day, cur);
    totals.points += e.points;
    totals.durationSec += e.durationMin * 60;
    const m = e.module ?? "general";
    moduleMinutes[m] = (moduleMinutes[m] ?? 0) + e.durationMin;
  }
  return buildStats(byDay, localDay(new Date(), TZ), totals, moduleMinutes);
}

type StatsContext = {
  stats: TrackerStats;
  isGuest: boolean;
  openLog: (module?: string) => void;
  /** Logs time a module measured; `celebrate` shows the celebration screen. */
  logTimed: (target: TimedTarget, seconds: number, celebrate: boolean) => void;
};

const Ctx = createContext<StatsContext | null>(null);

export function useStats(): StatsContext {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStats must be used inside <StatsProvider>");
  return v;
}

/** One source of tracker stats for the whole app: DB for members, browser for guests. */
export function StatsProvider({
  initial,
  children,
}: {
  initial: TrackerStats | null;
  children: React.ReactNode;
}) {
  const isGuest = initial === null;
  const guestEvents = useSyncExternalStore(
    guestStore.subscribe,
    guestStore.getSnapshot,
    guestStore.getServerSnapshot,
  );
  const localStats = useMemo(() => guestStats(guestEvents), [guestEvents]);
  const [memberStats, setMemberStats] = useState(initial);
  const stats = isGuest ? localStats : (memberStats ?? localStats);

  const [sheetModule, setSheetModule] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<CelebrationData | null>(null);
  const [pending, startTransition] = useTransition();

  const openLog = useCallback((module = "general") => {
    setError(null);
    setSheetModule(module);
  }, []);
  const closeLog = useCallback(() => setSheetModule(null), []);
  const closeCelebration = useCallback(() => setCelebration(null), []);

  function submit(module: string, minutes: number) {
    const before = stats;
    startTransition(async () => {
      let after: TrackerStats;
      if (isGuest) {
        guestStore.add({
          day: localDay(new Date(), TZ),
          durationMin: minutes,
          points: pointsForStudyLog(minutes),
          module,
        });
        after = guestStats(guestStore.getSnapshot());
      } else {
        const res = await logStudyAction(module, minutes).catch(() => null);
        if (!res) {
          setError("Бүртгэж чадсангүй. Сүлжээгээ шалгаад дахин оролдоно уу.");
          return;
        }
        setMemberStats(res);
        after = res;
      }
      setSheetModule(null);
      setCelebration({
        firstToday: before.todayPoints === 0,
        streak: after.streak,
        earned: after.todayPoints - before.todayPoints,
        todayMinutes: after.todayMinutes,
        week: after.week,
        isGuest,
      });
    });
  }

  const logTimed = useCallback(
    async (target: TimedTarget, seconds: number, celebrate: boolean) => {
      if (seconds < MIN_TIMED_SEC) return;
      const before = stats;
      let after: TrackerStats;
      if (isGuest) {
        // Guests can only listen (saving and review need an account, ADR 0010).
        if (target.module !== "listening") return;
        const slug = target.ref;
        // Same rule as the server: points follow cumulative time for this clip today.
        const day = localDay(new Date(), TZ);
        const prev = guestStore.getSnapshot().filter((e) => e.ref === slug && e.day === day);
        const prevMin = prev.reduce((sum, e) => sum + e.durationMin, 0);
        const prevPts = prev.reduce((sum, e) => sum + e.points, 0);
        const minutes = Math.floor(seconds / 60);
        guestStore.add({
          day,
          durationMin: minutes,
          points: Math.max(0, pointsForStudyLog(prevMin + minutes) - prevPts),
          module: "listening",
          ref: slug,
        });
        after = guestStats(guestStore.getSnapshot());
      } else {
        const res = await logTimedAction(target, seconds).catch(() => null);
        if (!res) return;
        setMemberStats(res);
        after = res;
      }
      const earned = after.todayPoints - before.todayPoints;
      // Repeat sessions within the cumulative window can earn 0 — no "+0" celebration.
      if (celebrate && earned > 0) {
        setCelebration({
          firstToday: before.todayPoints === 0,
          streak: after.streak,
          earned,
          todayMinutes: after.todayMinutes,
          week: after.week,
          isGuest,
        });
      }
    },
    [stats, isGuest],
  );

  const value = useMemo(
    () => ({ stats, isGuest, openLog, logTimed }),
    [stats, isGuest, openLog, logTimed],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {sheetModule !== null && (
        <LogSheet
          initialModule={sheetModule}
          isGuest={isGuest}
          pending={pending}
          error={error}
          onClose={closeLog}
          onSubmit={submit}
        />
      )}
      {celebration && <Celebration data={celebration} onClose={closeCelebration} />}
    </Ctx.Provider>
  );
}
