// Catches English answers typed with a Cyrillic keyboard layout still active (ADR 0018).
// Many learners switch between Mongolian and English keyboards on their phones.

/** True when the text has any Cyrillic letter (U+0400–U+04FF, which includes Mongolian ө and ү). */
export function hasCyrillic(text: string): boolean {
  return /[Ѐ-ӿ]/.test(text);
}

/**
 * Windows "Mongolian Cyrillic" (KBDMON, KLID 00000450): the Cyrillic letter each US key types.
 * Source: the layout's KLC file, https://kbdlayout.info/kbdmon/download/klc (checked 2026-09-16).
 */
const MONGOLIAN: Record<string, string> = {
  ф: "q", ц: "w", у: "e", ж: "r", э: "t", н: "y", г: "u", ш: "i", ү: "o", з: "p", к: "[", ъ: "]",
  й: "a", ы: "s", б: "d", ө: "f", а: "g", х: "h", р: "j", о: "k", л: "l", д: ";", п: "'",
  я: "z", ч: "x", ё: "c", с: "v", м: "b", и: "n", т: "m", ь: ",", в: ".", ю: "/",
  е: "-", щ: "=",
};

/** Standard Russian ЙЦУКЕН, which some Mongolian phones and computers use. */
const RUSSIAN: Record<string, string> = {
  й: "q", ц: "w", у: "e", к: "r", е: "t", н: "y", г: "u", ш: "i", щ: "o", з: "p", х: "[", ъ: "]",
  ф: "a", ы: "s", в: "d", а: "f", п: "g", р: "h", о: "j", л: "k", д: "l", ж: ";", э: "'",
  я: "z", ч: "x", с: "c", м: "v", и: "b", т: "n", ь: "m", б: ",", ю: ".", ё: "`",
};

function convert(text: string, layout: Record<string, string>): string {
  return [...text]
    .map((ch) => {
      const lower = ch.toLowerCase();
      const key = layout[lower];
      if (!key) return ch;
      return ch === lower ? key : key.toUpperCase();
    })
    .join("");
}

/** What Cyrillic input spells on an English keyboard: the Mongolian layout first, then Russian. */
export function latinGuesses(text: string): string[] {
  const guesses = [convert(text, MONGOLIAN), convert(text, RUSSIAN)].filter((g) => !hasCyrillic(g));
  return [...new Set(guesses)];
}
