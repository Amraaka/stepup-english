"use client";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("stepup.theme", next);
  } catch {
    /* private mode */
  }
}

const icon = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Гэрэлтэй / харанхуй горим солих"
      className="grid size-11 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:bg-canvas hover:text-foreground"
    >
      {/* sun — shown in dark mode (tap → light) */}
      <svg {...icon} className="hidden dark:block">
        <circle cx="10" cy="10" r="4" />
        <path d="M10 1.8v1.9M10 16.3v1.9M18.2 10h-1.9M3.7 10H1.8M15.8 4.2l-1.3 1.3M5.5 14.5l-1.3 1.3M15.8 15.8l-1.3-1.3M5.5 5.5 4.2 4.2" />
      </svg>
      {/* moon — shown in light mode (tap → dark) */}
      <svg {...icon} className="dark:hidden">
        <path d="M16.5 11.7A6.8 6.8 0 0 1 8.3 3.5a6.8 6.8 0 1 0 8.2 8.2Z" />
      </svg>
    </button>
  );
}
