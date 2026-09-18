import type { Fit } from "@/lib/dictionary/coverage";

// How a coverage estimate looks on cards and the player (ADR 0022).

export const FIT_LABEL: Record<Fit, string> = {
  fit: "Яг тохирно",
  stretch: "Сорилт",
  hard: "Одоохондоо хэцүү",
};

export const FIT_PILL: Record<Fit, string> = {
  fit: "bg-mint-soft text-mint-text",
  stretch: "bg-sun-soft text-sun-text",
  hard: "bg-coral-soft text-coral-a-text",
};

const FIT_STROKE: Record<Fit, string> = {
  fit: "stroke-mint",
  stretch: "stroke-sun",
  hard: "stroke-coral-a",
};

const R = 19;
const C = 2 * Math.PI * R;

/** A ring filled to `percent`, with the number inside. */
export function CoverageRing({ percent, fit, className = "size-12" }: { percent: number; fit: Fit; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label={`Үгийн ${percent}%-ийг мэднэ`}>
      <circle cx="24" cy="24" r={R} fill="none" strokeWidth="6" className="stroke-line" />
      <circle
        cx="24"
        cy="24"
        r={R}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(C * percent) / 100} ${C}`}
        transform="rotate(-90 24 24)"
        className={FIT_STROKE[fit]}
      />
      <text x="24" y="28" textAnchor="middle" className="fill-foreground text-[11.5px] font-extrabold tabular-nums">
        {percent}%
      </text>
    </svg>
  );
}
