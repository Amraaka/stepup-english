export function ProgressBar({
  value,
  max,
  label,
  fill = "bg-coral-a",
  track = "bg-ink-400/15",
  className = "h-2.5",
}: {
  value: number;
  max: number;
  label: string;
  fill?: string;
  track?: string;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
      className={`overflow-hidden rounded-full ${track} ${className}`}
    >
      <div
        className={`h-full rounded-full ${fill} transition-[width] duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
