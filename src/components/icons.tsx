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

export function PlayIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M6 3.8v12.4a.8.8 0 0 0 1.2.7l10-6.2a.8.8 0 0 0 0-1.4l-10-6.2A.8.8 0 0 0 6 3.8Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="5" y="3.5" width="3.4" height="13" rx="1" fill="currentColor" />
      <rect x="11.6" y="3.5" width="3.4" height="13" rx="1" fill="currentColor" />
    </svg>
  );
}

/** Circular arrow back — "hear that again". */
export function ReplayIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4.2 8.2A6.2 6.2 0 1 1 3.8 11" />
      <path d="M3.5 4.2v4.3h4.3" />
    </svg>
  );
}

export function EyeIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M1.8 10S4.8 4.5 10 4.5 18.2 10 18.2 10 15.2 15.5 10 15.5 1.8 10 1.8 10Z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}

export function EyeOffIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M8.2 4.7A8 8 0 0 1 10 4.5c5.2 0 8.2 5.5 8.2 5.5a14 14 0 0 1-2.1 2.8M5.5 6.1C3.1 7.6 1.8 10 1.8 10s3 5.5 8.2 5.5a8 8 0 0 0 4-1.1" />
      <path d="M8.2 8.3a2.5 2.5 0 0 0 3.5 3.5M3 3l14 14" />
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

export function TargetIcon(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="3.5" />
      <circle cx="10" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function ShieldCheckIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M10 2.5 16 5v5c0 3.8-2.6 6.4-6 7.5C6.6 16.4 4 13.8 4 10V5l6-2.5Z" />
      <path d="m7.5 9.7 1.8 1.8 3.2-3.3" />
    </svg>
  );
}

export function MapIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M3.5 5.5 8 3.5l4 2 4.5-2v11L12 16.5l-4-2-4.5 2v-11ZM8 3.5v11M12 5.5v11" />
    </svg>
  );
}

export function BoltIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M11 2.5 4.5 11H10l-1 6.5L15.5 9H10l1-6.5Z" />
    </svg>
  );
}

export function GiftIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M3.5 8h13v3h-13zM4.5 11h11v6h-11zM10 8v9M10 8C8 4.5 5 5 6.5 7.5M10 8c2-3.5 5-3 3.5-.5" />
    </svg>
  );
}

export function CheckIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="m5 10.5 3.2 3L15 6.5" />
    </svg>
  );
}

export function ChevronLeftIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="m12 5-5 5 5 5" />
    </svg>
  );
}

export function ChevronRightIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="m8 5 5 5-5 5" />
    </svg>
  );
}

export function ArrowUpIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M10 15V5M5.5 9.5 10 5l4.5 4.5" />
    </svg>
  );
}

export function MedalIcon(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="10" cy="8" r="4.5" />
      <path d="m7.5 12-1.5 5.5 4-2 4 2-1.5-5.5" />
    </svg>
  );
}

export function CalendarIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="3.5" y="4.5" width="13" height="12" rx="2" />
      <path d="M3.5 8.5h13M7 3v3M13 3v3" />
    </svg>
  );
}

export function PlusIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function XIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

export function VocabularyIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="3.5" y="4" width="13" height="12" rx="2" />
      <path d="m6.3 13 2.1-6 2.1 6M7.1 11h2.6M13.6 9.3v3.7M12.3 10.4c.4-.7 1.1-1.1 1.9-1" />
    </svg>
  );
}

export function GrammarIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 5.5h10M4 9.5h7M4 13.5h5M11.5 13.8l2 2 3.5-3.8" />
    </svg>
  );
}

export function PanelCloseIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3.5" width="14" height="13" rx="2" />
      <path d="M8 3.5v13M13.6 8.2 11.8 10l1.8 1.8" />
    </svg>
  );
}

export function PanelOpenIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3.5" width="14" height="13" rx="2" />
      <path d="M8 3.5v13M11.6 8.2 13.4 10l-1.8 1.8" />
    </svg>
  );
}

export function HeadphonesIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M3.5 13v-2.5a6.5 6.5 0 0 1 13 0V13" />
      <rect x="3" y="11.5" width="3.5" height="5" rx="1.3" />
      <rect x="13.5" y="11.5" width="3.5" height="5" rx="1.3" />
    </svg>
  );
}

export function BookIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M10 5.5C8.5 4.2 6.3 3.8 3.5 4v11c2.8-.2 5 .2 6.5 1.5M10 5.5c1.5-1.3 3.7-1.7 6.5-1.5v11c-2.8-.2-5 .2-6.5 1.5M10 5.5v11" />
    </svg>
  );
}

export function PencilIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12.5 4.5 15.5 7.5M3.5 16.5l.8-3.6 9.3-9.3a1.5 1.5 0 0 1 2.1 0l.7.7a1.5 1.5 0 0 1 0 2.1l-9.3 9.3-3.6.8Z" />
    </svg>
  );
}

export function MicIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="7.5" y="2.5" width="5" height="9" rx="2.5" />
      <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5" />
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
