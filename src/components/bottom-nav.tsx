import Link from "next/link";
import { HomeIcon, GridIcon, UserIcon, SignInIcon } from "@/components/icons";

export function BottomNav({ isGuest }: { isGuest: boolean }) {
  const item =
    "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted transition-colors hover:text-foreground [&[aria-current]]:text-coral-a-text";
  return (
    <nav
      aria-label="Доод цэс"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-ink-400/15 bg-background/90 backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-stretch px-2 pb-[env(safe-area-inset-bottom)]">
        <Link href="/" className={item} aria-current="page">
          <HomeIcon />
          Нүүр
        </Link>
        <Link href="/#modules" className={item}>
          <GridIcon />
          Модулиуд
        </Link>
        {isGuest ? (
          <Link href="/login" className={item}>
            <SignInIcon />
            Нэвтрэх
          </Link>
        ) : (
          <Link href="/#tracker" className={item}>
            <UserIcon />
            Профайл
          </Link>
        )}
      </div>
    </nav>
  );
}
