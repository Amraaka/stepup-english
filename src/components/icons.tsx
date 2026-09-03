// Tiny authored icon set — one stroke weight (1.7), 20px grid.
type P = { className?: string };
const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: p.className,
});

export function FlameIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M10 2.5c.6 2.6-.8 3.9-2.3 5.4C6.2 9.4 5 10.9 5 13a5 5 0 0 0 10 0c0-1.6-.6-3-1.6-4.3-.4 1-.9 1.6-1.9 2.2.3-2.9-.2-6-1.5-8.4Z" />
    </svg>
  );
}

export function ClockIcon(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.5V10l2.4 1.7" />
    </svg>
  );
}

export function LockIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="4.5" y="9" width="11" height="7.5" rx="2" />
      <path d="M7 9V6.8a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

export function ArrowRightIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export function StarIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M10 3l2.1 4.3 4.7.7-3.4 3.3.8 4.7L10 13.8 5.8 16l.8-4.7L3.2 8l4.7-.7L10 3Z" />
    </svg>
  );
}

export function HomeIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M3.5 8.5 10 3l6.5 5.5V16a1 1 0 0 1-1 1h-3.6v-4.6H8.1V17H4.5a1 1 0 0 1-1-1V8.5Z" />
    </svg>
  );
}

export function GridIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  );
}

export function UserIcon(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4 17c.8-3 3.2-4.4 6-4.4S15.2 14 16 17" />
    </svg>
  );
}

export function SignInIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M8 3.5H5a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 5 16.5h3M12.5 6.5 16 10l-3.5 3.5M16 10H7.5" />
    </svg>
  );
}
