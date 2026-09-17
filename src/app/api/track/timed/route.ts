import { getCurrentUser } from "@/lib/auth";
import { recordTimed } from "@/lib/timed";

/**
 * Timed study sent with `navigator.sendBeacon` when a page is hidden or closed (ADR 0015).
 * A server action started during unload can be cancelled by the browser; a beacon is not.
 * Same rules as `logTimedAction`, but no stats in the response: nobody is left to read them.
 */
export async function POST(request: Request) {
  // Beacons from this site only. Session cookies are SameSite=Lax as well.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    // `Origin: null` (sandboxed frames, some redirects) isn't a URL.
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      /* not a URL */
    }
    if (originHost !== host) return new Response(null, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) return new Response(null, { status: 401 });

  const body = (await request.json().catch(() => null)) as { target?: unknown; seconds?: unknown } | null;
  const ok = body ? await recordTimed(user.id, body.target, body.seconds) : false;
  return new Response(null, { status: ok ? 204 : 400 });
}
