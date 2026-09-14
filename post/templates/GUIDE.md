# StepUp English — post production guide (for agents and humans)

Every post is one self-contained HTML file rendered to a 1080×1350 PNG.

## Files

- `post.css` — all styles. `<div class="s L">` = light, `<div class="s D">` = dark. Variant classes documented at the top of the file; open `social-studio.html` in a browser to see every variant rendered (sections 01–04).
- `logo.svg` — brand mark. Reference it as `../templates/logo.svg` from `post/<date>/`.
- `render.sh <file.html>` — writes `<file>.png` next to it. Takes ~5 s.

## Post HTML skeleton

```html
<!doctype html><html lang="mn"><head><meta charset="utf-8">
<link rel="stylesheet" href="../templates/post.css">
<style>/* post-specific tweaks only */</style></head><body>
<div class="s L">
  <div class="hd"><div class="brand"><div class="lg"><img src="../templates/logo.svg" alt=""></div><div><b>StepUp <span>English</span></b><small>@stepupenglish.mn</small></div></div><div class="tag">ГАРЧИГ</div></div>
  <div class="mid"> … </div>
  <div class="ft"><span>доод зүүн текст</span><span class="go">Swipe →</span></div>
</div></body></html>
```

The `.hd` header (logo + handle) and `.ft` footer are mandatory on every post. Everything in `.mid` is yours.

## Brand

- Charcoal `#16161a` + coral `#ff5a3c` (dark: `#ff6a4a`). Amber `#ffb020` sparingly. Nothing else unless the variant defines it (MG: blue/gold/red; ST: sky/grass).
- Type: Manrope for everything; Rubik 900 for loud headlines; Instrument Serif italic for editorial; JetBrains Mono for receipts/codes; Caveat for handwritten notes. Never mix more than two per post.
- Personality: serious, energetic, trustworthy. Adults and young adults. Not a kids' app — no rainbow palettes, no clip-art.

## Design bar (this is what "designer-quality" means here)

1. **One idea per post.** If the viewer can't get it in 2 seconds at thumbnail size, cut.
2. **Hierarchy through size, not decoration.** Headline ≥ 84px. Body ≥ 34px. Nothing below 24px. Contrast must pass AA (coral on white only at ≥ 40px bold).
3. **Whitespace is a feature.** Minimum 72px side padding (already set). Don't fill the canvas — a post with 40% empty space reads as premium.
4. **Alignment.** Everything on the same left edge unless deliberately centered. No orphan words on their own line in headlines — use `<br>` to control breaks.
5. **Mongolian Cyrillic sets wider than Latin.** Test every headline: if it wraps to 3+ lines, shrink it or shorten the copy. Ө, Ү, Ж, Щ need room.
6. **Emoji: max 2 per post, and only when they carry meaning** (🥟 for buuz, ❄️ for cold). Never as decoration.
7. **Real examples, not placeholders.** Every English sentence must be one a native speaker would actually say.
8. **Light and dark are separate decisions.** Pick the one that serves the content; don't default to light.

## Writing bar (Mongolian)

Follow the `stepup-caption-voice` skill (`.claude/skills/stepup-caption-voice/SKILL.md`) for every caption and every line of Mongolian on the image. Its self-check is the acceptance test.

## Deliverable per post

```
post/2026-09-15/
  1-0800-<slug>.html   1-0800-<slug>.png
  2-1230-<slug>.html   2-1230-<slug>.png
  3-2030-<slug>.html   3-2030-<slug>.png
  captions.md          ← all three captions + a one-line Story idea per post
```

Before finishing: open each PNG and check for overflow, clipped text, wrong wrapping, orphans, anything below 24px. Fix and re-render. Say what you checked.
