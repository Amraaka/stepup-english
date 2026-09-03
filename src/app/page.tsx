import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getProfile } from "@/lib/activity";
import { Navbar } from "@/components/navbar";
import { TrackerPanel, LogFields } from "@/components/tracker-panel";
import { GuestTracker } from "@/components/guest-tracker";
import { ModuleList } from "@/components/module-list";
import { BottomNav } from "@/components/bottom-nav";
import { HowItWorks } from "@/components/how-it-works";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { logStudy } from "@/app/app/actions";

const LOGGED_IN_MODULES: [string, string][] = [
  ["general", "Ерөнхий"],
  ["vocabulary", "Үгийн сан"],
  ["grammar", "Дүрэм"],
  ["listening", "Сонсгол"],
  ["reading", "Унших"],
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfile(user.id) : null;
  const stats = user
    ? await getDashboardStats(user.id, profile?.timezone ?? "Asia/Ulaanbaatar")
    : null;
  const firstName = (profile?.displayName || user?.email || "").split(" ")[0];

  return (
    <>
      <Navbar />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(255_90_60/0.07),transparent_70%)]"
      />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 lg:pb-16 lg:pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="flex flex-col gap-5" id="tracker">
            {user ? (
              <>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    Сайн уу, {firstName}!
                  </h1>
                </div>
                {stats && (
                  <TrackerPanel stats={stats}>
                    <form action={logStudy}>
                      <LogFields modules={LOGGED_IN_MODULES} />
                    </form>
                  </TrackerPanel>
                )}
              </>
            ) : (
              <>
                <div>
                  <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-balance lg:text-4xl">
                    Англи хэлээ өдөр бүр{" "}
                    <span className="text-coral-a-text">жаахан</span> ахиул
                  </h1>
                  <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-muted">
                    Өдөр бүр багахан хугацаа гаргаад, явцаа нэг дороос хяна.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <a
                      href="/login?mode=signup"
                      className="inline-flex items-center gap-1.5 rounded-full bg-coral-a px-5 py-2.5 text-sm font-bold text-ink-950 shadow-[0_10px_24px_-10px_rgb(255_90_60/0.6)] transition-opacity hover:opacity-90"
                    >
                      Үнэгүйгээр эхлэх
                    </a>
                    <span className="rounded-full border border-ink-400/25 px-3 py-1.5 text-xs font-semibold text-muted">
                      Бүртгэлгүй туршиж болно
                    </span>
                    <span className="rounded-full border border-ink-400/25 px-3 py-1.5 text-xs font-semibold text-muted">
                      Монгол хэл дээр
                    </span>
                  </div>
                </div>
                <HowItWorks />
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight">
                    Шууд туршаад үз
                  </h2>
                  <p className="mb-3 mt-1 text-[13px] text-muted">
                    Бүртгэлгүйгээр шууд туршиж болно.
                  </p>
                  <GuestTracker />
                </div>
              </>
            )}
          </div>

          <ModuleList isGuest={!user} />
        </div>

        {!user && (
          <>
            <div className="my-12 border-t border-ink-400/15" />
            <Faq />
            <section className="mt-12 rounded-3xl bg-ink-900 px-6 py-10 text-center text-ink-100">
              <h2 className="text-2xl font-extrabold tracking-tight text-balance">
                Өнөөдрөөс эхэлье
              </h2>
              <p className="mx-auto mt-2 max-w-[36ch] text-sm text-ink-400">
                Бүртгүүлээд явцаа хаанаас ч үргэлжлүүл.
              </p>
              <a
                href="/login?mode=signup"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-coral-a px-6 py-3 text-sm font-bold text-ink-950 transition-opacity hover:opacity-90"
              >
                Үнэгүйгээр бүртгүүлэх
              </a>
            </section>
          </>
        )}
      </main>
      <Footer />
      <BottomNav isGuest={!user} />
    </>
  );
}
