import { readdirSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["600", "800"] });

const CANDIDATES_DIR = path.join(process.cwd(), "public", "brand", "candidates");
const IMAGE_EXT = /\.(png|jpe?g|webp|svg)$/i;
const SIZES = [16, 32, 48, 96, 192];

function listCandidates() {
  try {
    return readdirSync(CANDIDATES_DIR)
      .filter((f) => IMAGE_EXT.test(f))
      .sort();
  } catch {
    return [];
  }
}

function coralFor(file: string) {
  return /-b(-|\.)/.test(file) ? "var(--coral-b)" : "var(--coral-a)";
}

function Wordmark({ color, coral }: { color: string; coral: string }) {
  return (
    <div className={`${manrope.className} leading-none`} style={{ color }}>
      <div className="text-2xl font-extrabold tracking-tight">
        Step<span style={{ color: coral }}>Up</span>
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] opacity-60">
        English
      </div>
    </div>
  );
}

function Ground({
  file,
  dark,
}: {
  file: string;
  dark: boolean;
}) {
  const src = `/brand/candidates/${file}`;
  const bg = dark ? "var(--ink-950)" : "#ffffff";
  const fg = dark ? "var(--ink-100)" : "var(--ink-900)";
  const coral = coralFor(file);
  return (
    <div
      className="flex flex-col gap-4 rounded-xl p-4"
      style={{ background: bg, color: fg, colorScheme: dark ? "dark" : "light" }}
    >
      <div className="flex items-end gap-4">
        {SIZES.map((s) => (
          <div key={s} className="flex flex-col items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" width={s} height={s} style={{ width: s, height: s }} />
            <span className="text-[10px] opacity-50">{s}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <div
          className="flex size-16 items-center justify-center overflow-hidden rounded-2xl"
          style={{ background: dark ? "var(--ink-900)" : "var(--ink-50)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" style={{ width: 44, height: 44 }} />
        </div>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" style={{ width: 36, height: 36 }} />
          <Wordmark color={fg} coral={coral} />
        </div>
        <button
          type="button"
          className={`${manrope.className} ml-auto rounded-full px-4 py-2 text-sm font-bold`}
          style={{ background: coral, color: dark ? "var(--ink-950)" : "var(--ink-900)" }}
        >
          Start today
        </button>
      </div>
    </div>
  );
}

export default function BrandPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const files = listCandidates();

  return (
    <main className="mx-auto max-w-4xl space-y-10 p-6">
      <header className="space-y-2">
        <h1 className={`${manrope.className} text-3xl font-extrabold`}>Brand contact sheet</h1>
        <p className="text-muted text-sm">
          Drop candidates into <code>public/brand/candidates/</code> as{" "}
          <code>&lt;family&gt;-&lt;a|b&gt;-&lt;n&gt;.png</code>. Files with <code>-b-</code> use
          pink-coral; everything else uses orange-coral. Prompts: <code>docs/brand/logo-prompts.md</code>.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Palette</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[
            ["ink-950", "var(--ink-950)"],
            ["ink-900", "var(--ink-900)"],
            ["ink-600", "var(--ink-600)"],
            ["ink-400", "var(--ink-400)"],
            ["ink-100", "var(--ink-100)"],
            ["ink-50", "var(--ink-50)"],
            ["coral-a", "var(--coral-a)"],
            ["coral-a-text", "var(--coral-a-text)"],
            ["coral-b", "var(--coral-b)"],
            ["coral-b-text", "var(--coral-b-text)"],
          ].map(([name, value]) => (
            <div key={name} className="space-y-1">
              <div className="h-12 rounded-lg border border-black/10" style={{ background: value }} />
              <div className="text-xs">{name}</div>
            </div>
          ))}
        </div>
      </section>

      {files.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted">
          No candidates yet.
        </p>
      ) : (
        files.map((file) => (
          <section key={file} className="space-y-3">
            <h2 className="font-mono text-sm">{file}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Ground file={file} dark={false} />
              <Ground file={file} dark />
            </div>
          </section>
        ))
      )}
    </main>
  );
}
