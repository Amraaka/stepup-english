import type { TimelineMark } from "@/lib/grammar/types";

const W = 320;
const LINE_Y = 58;
const x = (pos: number) => W / 2 + pos * 140;

/** Past · now · future line with the lesson's marks (dots, spans, arrows). */
export function Timeline({ marks, caption }: { marks: TimelineMark[]; caption: string }) {
  return (
    <figure>
      <svg viewBox={`0 0 ${W} 100`} className="mx-auto w-full max-w-[520px]" role="img" aria-label={caption}>
        <defs>
          <marker id="tl-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 10 5 0 10z" className="fill-rose" />
          </marker>
        </defs>

        <line x1={12} x2={W - 12} y1={LINE_Y} y2={LINE_Y} className="stroke-ink-400/40" strokeWidth={2} strokeLinecap="round" />
        <line x1={x(0)} x2={x(0)} y1={LINE_Y - 12} y2={LINE_Y + 12} className="stroke-ink-400" strokeWidth={2} strokeDasharray="3 3" />

        {marks.map((m, i) => {
          if (m.type === "dot") {
            return (
              <g key={i}>
                <circle cx={x(m.at)} cy={LINE_Y} r={7} className="fill-coral-a stroke-surface" strokeWidth={2.5} />
                {m.label && (
                  <text x={x(m.at)} y={LINE_Y - 16} textAnchor="middle" className="fill-foreground text-[11px] font-bold">
                    {m.label}
                  </text>
                )}
              </g>
            );
          }
          const x1 = x(m.from);
          const x2 = x(m.to);
          const mid = (x1 + x2) / 2;
          const label = m.label && (
            <text x={mid} y={LINE_Y - 36} textAnchor="middle" className="fill-rose-text text-[11px] font-bold">
              {m.label}
            </text>
          );
          if (m.type === "dots") {
            const n = 7;
            return (
              <g key={i}>
                {Array.from({ length: n }, (_, k) => (
                  <circle key={k} cx={x1 + ((x2 - x1) * k) / (n - 1)} cy={LINE_Y} r={5} className="fill-rose" />
                ))}
                {label}
              </g>
            );
          }
          if (m.type === "span") {
            return (
              <g key={i}>
                <rect x={x1} y={LINE_Y - 7} width={x2 - x1} height={14} rx={7} className="fill-rose/70" />
                {label}
              </g>
            );
          }
          return (
            <g key={i}>
              <circle cx={x1} cy={LINE_Y} r={5} className="fill-rose" />
              <path
                d={`M${x1} ${LINE_Y} Q${mid} ${LINE_Y - 30} ${x2 - 4} ${LINE_Y - 6}`}
                className="stroke-rose"
                strokeWidth={2.5}
                fill="none"
                markerEnd="url(#tl-head)"
              />
              {label}
            </g>
          );
        })}

        <text x={24} y={92} className="fill-muted text-[11px] font-semibold">
          Өнгөрсөн
        </text>
        <text x={x(0)} y={92} textAnchor="middle" className="fill-foreground text-[11px] font-extrabold">
          Одоо
        </text>
        <text x={W - 24} y={92} textAnchor="end" className="fill-muted text-[11px] font-semibold">
          Ирээдүй
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}
