# 0004 — Brand identity: logo direction and palette

Date: 2026-09-01
Status: accepted (exploration phase; the final mark is still to be chosen)

## Context

There is no logo or palette yet. The product needs a PWA icon, favicon, and a
consistent color system before MVP work starts, but a full brand identity is
premature for a solo pre-MVP project. ADR 0003 sets the audience as adults and
young adults, which rules out a playful "kids' app" look.

## Decision

### Personality and audience

- Faces adults / young adults; teens are served by a mature brand, adults are
  repelled by a childish one.
- Personality: **serious, energetic, trustworthy**.
- International look. No overt Mongolian visual cues; Mongolian shows up in the
  language, not the mark.

### The mark

- Represents **rising / upward motion**. Explicitly not a static staircase.
- Six concept families explored, one prompt each per accent variant
  (see `docs/brand/logo-prompts.md`): ascending arc or trajectory, "S"/"U"
  letterform with an upward stroke, folding ribbon, wing, mountain with a rising
  line, sprout.
- Exploration rendering styles: glassy 3D (arc, ribbon, mountain) and thin line
  (letterform, wing, sprout). Both degrade at small sizes, so the chosen concept
  is redrawn as a **solid-fill SVG** for production.
- Wordmark: `StepUp` large in CamelCase, `English` small beneath. Geometric
  sans with Cyrillic support — shortlist **Manrope**, Plus Jakarta Sans — the
  same family the app UI will use.

### Palette

Near-monochrome: charcoal primary, coral as the only accent. The accent carries
streaks, achievements, and calls to action. Two coral temperatures are in play
until the mark is chosen.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `ink-950` | — | `#121215` | dark-mode page background |
| `ink-900` | `#1A1A1F` | — | primary / body text on light (17.3:1) |
| `ink-600` | `#5C5C66` | — | muted text on light (6.6:1) |
| `ink-400` | — | `#A0A0AA` | muted text on dark (7.2:1) |
| `ink-100` | — | `#EDEDF0` | body text on dark (16:1) |
| `ink-50` | `#F6F6F8` | — | light-mode surface |
| `coral-a` | `#FF5A3C` | `#FF7A5C` | orange-coral fill / icon / large text |
| `coral-a-text` | `#C8361B` | — | orange-coral for small text on light (5.3:1) |
| `coral-b` | `#FF4D6D` | `#FF6B85` | pink-coral fill / icon / large text |
| `coral-b-text` | `#C81E42` | — | pink-coral for small text on light (5.6:1) |

Rules:

- The bright coral fills fail WCAG AA for small text on white (~3.1:1). Use them
  for fills, icons, and text ≥ 24px; use the `-text` variants for small text.
- White text on a coral button is also ~3.1:1 — acceptable for large button
  labels, not for small ones. Prefer `ink-900` text on coral, or coral text on
  ink.
- Neutrals are pure grays with a slight cool cast, not tinted toward the accent.

Tokens live in `src/app/globals.css` under `@theme`.

### Process

1. Twelve ChatGPT image prompts (6 families × 2 coral temperatures), icon-only on
   a plain background, in `docs/brand/logo-prompts.md`. Prompts are written so
   the style word can be swapped by hand.
2. Outputs are dropped into `public/brand/candidates/` and reviewed on the
   dev-only `/brand` route, which shows each candidate at favicon, app-icon, and
   header sizes on light and dark grounds, next to the wordmark.
3. After the icon style is chosen, 2–3 lockup prompts (icon + wordmark) refine
   the winner.
4. The winning concept is redrawn as a clean SVG in `public/`, with favicon and
   PWA icon sizes generated from it. This ADR is then updated with the final mark
   and the losing coral variant is removed from the tokens.

### Inspiration sources

Brand New (underconsideration.com/brandnew) for how identities are reasoned
about; LogoLounge and Dribbble ("language app logo") for volume; Behance for
full case studies pairing icon, palette, and app screens. Look for marks that
still read at 32px and work in one color. Pinterest is skipped — it recycles
the same arrows.

## Rejected alternatives

- **Blue primary** — most trustworthy but Busuu, ELSA, and half the category are
  blue.
- **Violet + coral / teal + coral** — considered as two-hue systems; rejected in
  favor of a one-color brand where coral does all the color work, for minimal
  maintenance and stronger recognition.
- **Plum + coral** — warm-on-warm reads as a cosmetics brand.
- **Staircase / stacked-chevron / rocket / bird icons** — staircase is static and
  literal; chevrons and rockets are fintech/startup clichés; birds are Duolingo
  territory.
- **Tinted neutrals** — nicer in theory, but with a charcoal primary there is
  nothing to tint toward; pure grays keep the system simple.
- **Hiring a designer now** — reasonable later if the product gets traction.

## Consequences

- `/brand` is a dev-only route (404 in production) and is deleted or gated once
  the mark is final.
- App UI font should be Manrope (or Plus Jakarta Sans) so brand and product feel
  continuous; adopting it app-wide is a follow-up.
- The vault decision note `20-Decisions/2026-09-01 - Brand identity direction.md`
  mirrors this ADR and closes the open "Logo / branding" todo in the product-name
  decision.
