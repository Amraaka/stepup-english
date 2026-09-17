"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
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

// Guest mode: events live in this browser only. Timed events keep exact seconds and when they
// were logged (`at`); older events have whole minutes only.
type GuestEvent = {
  day: string;
  durationMin: number;
  durationSec?: number;
  at?: number;
  points: number;
  module?: string;
  ref?: string;
};
const KEY = GUEST_EVENTS_KEY;
const TZ = "Asia/Ulaanbaatar";
/** Same cumulative-points window as the server's timed log. */
const TIMED_WINDOW_MS = 3 * 60 * 60 * 1000;

const secOf = (e: GuestEvent) => e.durationSec ?? e.durationMin * 60;

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
  const moduleSec: Record<string, number> = {};
  for (const e of events) {
    const sec = secOf(e);
    const cur = byDay.get(e.day) ?? { points: 0, durationSec: 0 };
    cur.points += e.points;
    cur.durationSec += sec;
    byDay.set(e.day, cur);
    totals.points += e.points;
    totals.durationSec += sec;
    const m = e.module ?? "general";
    moduleSec[m] = (moduleSec[m] ?? 0) + sec;
  }
  const moduleMinutes = Object.fromEntries(Object.entries(moduleSec).map(([m, sec]) => [m, Math.floor(sec / 60)]));
  return buildStats(byDay, localDay(new Date(), TZ), totals, moduleMinutes);
}

/**
 * Adds a guest's timed log with the server's cumulative-points rule. Returns false for modules
 * guests can't log (the word review needs an account, ADR 0010).
 */
function addGuestTimed(target: TimedTarget, seconds: number): boolean {
  if (target.module === "vocabulary") return false;
  const slug = target.ref;
  const now = Date.now();
  const day = localDay(new Date(now), TZ);
  const prev = guestStore
    .getSnapshot()
    .filter(
      (e) =>
        e.ref === slug &&
        e.module === target.module &&
        (e.at !== undefined ? now - e.at < TIMED_WINDOW_MS : e.day === day),
    );
  const prevSec = prev.reduce((sum, e) => sum + secOf(e), 0);
  const prevPts = prev.reduce((sum, e) => sum + e.points, 0);
  const sec = Math.floor(seconds);
  guestStore.add({
    day,
    durationMin: Math.floor(sec / 60),
    durationSec: sec,
    at: now,
    points: Math.max(0, pointsForStudyLog(Math.floor((prevSec + sec) / 60)) - prevPts),
    module: target.module,
    ref: slug,
  });
  return true;
}

type StatsContext = {
  stats: TrackerStats;
  isGuest: boolean;
  openLog: (module?: string) => void;
  /** Logs time a module measured; `celebrate` shows the celebration screen. */
  logTimed: (target: TimedTarget, seconds: number, celebrate: boolean) => void;
  /** Logs time from a page being hidden or closed, in a way the browser finishes after unload (ADR 0015). */
  beaconTimed: (target: TimedTarget, seconds: number) => void;
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
  // The layout stays mounted across navigations; take fresh server stats whenever they arrive
  // (a revalidation or `router.refresh()`), not only on the first render.
  const [syncedInitial, setSyncedInitial] = useState(initial);
  if (initial !== syncedInitial) {
    setSyncedInitial(initial);
    setMemberStats(initial);
  }
  const stats = isGuest ? localStats : (memberStats ?? localStats);

  const router = useRouter();
  const beaconSent = useRef(false);
  useEffect(() => {
    if (isGuest) return;
    let timer: number | undefined;
    const onVisible = () => {
      if (document.visibilityState !== "visible" || !beaconSent.current) return;
      beaconSent.current = false;
      // Time sent by beacon while hidden: give it a moment to land, then pull fresh stats.
      timer = window.setTimeout(() => router.refresh(), 1500);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearTimeout(timer);
    };
  }, [isGuest, router]);

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
        if (!addGuestTimed(target, seconds)) return;
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

  // A server action started while the page unloads can be cancelled, which lost members' pending time
  // on refresh or tab close. A beacon is finished by the browser; stats refresh when the tab is visible again (ADR 0015).
  const beaconTimed = useCallback(
    (target: TimedTarget, seconds: number) => {
      if (seconds < MIN_TIMED_SEC) return;
      if (isGuest) {
        addGuestTimed(target, seconds);
        return;
      }
      beaconSent.current = true;
      const body = JSON.stringify({ target, seconds });
      const sent =
        typeof navigator.sendBeacon === "function" &&
        navigator.sendBeacon("/api/track/timed", new Blob([body], { type: "application/json" }));
      if (!sent) {
        void fetch("/api/track/timed", {
          method: "POST",
          body,
          keepalive: true,
          headers: { "content-type": "application/json" },
        }).catch(() => {});
      }
    },
    [isGuest],
  );

  const value = useMemo(
    () => ({ stats, isGuest, openLog, logTimed, beaconTimed }),
    [stats, isGuest, openLog, logTimed, beaconTimed],
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
