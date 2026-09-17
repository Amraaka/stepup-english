import { Fragment } from "react";
import type { Marked } from "@/components/words/use-word-pick";

/** Words and names are tappable; numbers and bare punctuation are not. */
export function isTappable(key: string): boolean {
  return key !== "" && !/^\d/.test(key);
}

/** One sentence of tappable words. Tone classes are passed whole so Tailwind can see them. */
export function TappableTokens({
  tokens,
  keys,
  marked,
  onTap,
  hoverClass,
  onClass,
}: {
  tokens: string[];
  keys: string[];
  marked: Marked | null;
  onTap: (token: number) => void;
  hoverClass: string;
  onClass: string;
}) {
  return (
    <>
      {tokens.map((tok, j) => {
        const on = !!marked && j >= marked.start && j < marked.end;
        return (
          <Fragment key={j}>
            {isTappable(keys[j]) ? (
              <button
                type="button"
                onClick={() => onTap(j)}
                className={`-mx-0.5 rounded-md px-0.5 text-left transition-colors ${hoverClass} ${on ? onClass : ""}`}
              >
                {tok}
              </button>
            ) : (
              <span>{tok}</span>
            )}{" "}
          </Fragment>
        );
      })}
    </>
  );
}
