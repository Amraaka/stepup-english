import { MODULES } from "@/lib/modules";
import { ArrowRightIcon, LockIcon } from "@/components/icons";

export function ModuleList({ isGuest }: { isGuest: boolean }) {
  const featured = MODULES.filter((m) => m.status === "active");
  const soon = MODULES.filter((m) => m.status === "soon");

  return (
    <section aria-labelledby="modules-h" id="modules" className="scroll-mt-16">
      <h2 id="modules-h" className="text-lg font-extrabold tracking-tight">
        Модулиуд
      </h2>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        Шинэ модулиуд тогтмол нэмэгдэнэ — бүгд нэг оноонд тань нэгдэнэ.
      </p>

      <ul className="mt-3 flex flex-col gap-2">
        {featured.map((m) => {
          const locked = isGuest && !m.guest;
          return (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-2xl bg-coral-a/10 px-4 py-4 shadow-[0_10px_28px_-14px_rgb(255_90_60/0.45)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold">{m.name}</p>
                <p className="line-clamp-1 text-[13px] text-muted">{m.tagline}</p>
              </div>
              {locked ? (
                <span className="flex items-center gap-1 text-xs font-medium text-muted">
                  <LockIcon className="h-4 w-4" /> Бүртгэлтэй
                </span>
              ) : (
                <a
                  href="#tracker"
                  className="flex items-center gap-1 rounded-full bg-coral-a px-4 py-2 text-[13px] font-bold text-ink-950 transition-opacity hover:opacity-90"
                >
                  Эхлэх <ArrowRightIcon className="h-4 w-4" />
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-wider text-muted">
        Тун удахгүй
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {soon.map((m) => (
          <li
            key={m.id}
            className="rounded-2xl border border-ink-400/15 px-3.5 py-3 transition-colors duration-200 hover:border-coral-a/40"
            title={m.tagline}
          >
            <p className="text-sm font-bold text-muted">{m.name}</p>
            <p className="line-clamp-1 text-xs text-muted/70">{m.tagline}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
