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
  buildStats,
  localDay,
  pointsForStudyLog,
  type DayAgg,
  type TrackerStats,
} from "@/lib/tracker";
import { logStudyAction } from "@/app/(site)/actions";
import { GUEST_EVENTS_KEY } from "@/lib/guest";
import { LogSheet } from "@/components/game/log-sheet";
import { Celebration, type CelebrationData } from "@/components/game/celebration";

// Guest mode: events live in this browser only.
type GuestEvent = { day: string; durationMin: number; points: number; module?: string };
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

  const value = useMemo(() => ({ stats, isGuest, openLog }), [stats, isGuest, openLog]);

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
