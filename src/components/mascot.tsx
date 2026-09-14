export type MascotMood = "happy" | "cheer" | "think" | "calm";

/**
 * Placeholder mascot built from the logo's crescent and rising dart.
 * Final character art will replace this (PRODUCT.md, Brand Commitments).
 */
export function Mascot({ mood = "happy", className = "" }: { mood?: MascotMood; className?: string }) {
  const coral = "#FF5A3C";
  const pink = "#FF4D6D";
  const ink = "#121215";
  const pupilY = mood === "think" ? 63 : 68;

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      <ellipse cx="60" cy="114" rx="28" ry="4" fill={ink} opacity="0.12" />
      {mood === "cheer" ? (
        <g stroke={coral} strokeWidth="10" strokeLinecap="round">
          <path d="M30 74 12 50" />
          <path d="M90 74 108 50" />
        </g>
      ) : (
        <g stroke={coral} strokeWidth="10" strokeLinecap="round">
          <path d="M24 82 13 94" />
          <path d="M96 82 107 94" />
        </g>
      )}
      <path d="M60 18C86 18 102 43 102 71C102 98 84 111 60 111C36 111 18 98 18 71C18 43 34 18 60 18Z" fill={coral} />
      <ellipse cx="60" cy="92" rx="26" ry="15" fill="#fff" opacity="0.16" />
      <path d="M21 60C23 34 43 16 69 18C88 20 99 31 103 45C93 34 78 28 62 30C44 32 30 44 21 60Z" fill="#1B222C" />
      <path d="M73 31Q84 23 93 17" stroke={pink} strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="97" cy="14" r="6" fill={pink} />
      {mood === "calm" ? (
        <g stroke={ink} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d="M38 68Q47 74 56 68" />
          <path d="M66 68Q75 74 84 68" />
        </g>
      ) : (
        <g>
          <ellipse cx="47" cy="67" rx="10" ry="11" fill="#fff" />
          <ellipse cx="75" cy="67" rx="10" ry="11" fill="#fff" />
          <circle cx="49" cy={pupilY} r="5" fill={ink} />
          <circle cx="77" cy={pupilY} r="5" fill={ink} />
          <circle cx="51" cy="65" r="1.8" fill="#fff" />
          <circle cx="79" cy="65" r="1.8" fill="#fff" />
        </g>
      )}
      <ellipse cx="34" cy="83" rx="6" ry="3.5" fill={pink} opacity="0.45" />
      <ellipse cx="88" cy="83" rx="6" ry="3.5" fill={pink} opacity="0.45" />
      {mood === "happy" && <path d="M51 86Q61 95 71 86" stroke={ink} strokeWidth="3.5" strokeLinecap="round" fill="none" />}
      {mood === "cheer" && <path d="M49 84Q61 104 73 84Z" fill={ink} />}
      {mood === "think" && <circle cx="61" cy="90" r="4.5" fill={ink} />}
      {mood === "calm" && <path d="M54 89Q61 93 68 89" stroke={ink} strokeWidth="3.5" strokeLinecap="round" fill="none" />}
    </svg>
  );
}
