import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-ink-400/15">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" className="h-7 w-7" />
          <span className="text-sm font-extrabold">
            StepUp <span className="font-semibold text-muted">English</span>
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted">
          <Link href="/#modules" className="hover:text-foreground">
            Модулиуд
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Нэвтрэх
          </Link>
          <Link href="/login?mode=signup" className="hover:text-foreground">
            Бүртгүүлэх
          </Link>
        </nav>
        <p className="text-xs text-muted">© 2026 StepUp English</p>
      </div>
    </footer>
  );
}
