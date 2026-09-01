# Logo exploration prompts

Twelve prompts for ChatGPT image generation: six concept families × two coral
temperatures. Context and rules: ADR 0004.

## How to use

- Paste one prompt per generation. Ask for 4 variations each; that gives ~48
  candidates.
- Save outputs as PNG into `public/brand/candidates/` named
  `<family>-<a|b>-<n>.png`, e.g. `arc-a-1.png`. Then open `/brand` in the dev
  server to compare them at real sizes.
- Each prompt has a `STYLE` line. Swap it by hand to try the other rendering:
  - **Glassy 3D**: "rendered as a smooth glossy 3D object with soft studio
    lighting, subtle translucency and a single crisp highlight, no drop shadow"
  - **Thin line**: "drawn as a single continuous thin line of uniform stroke
    weight, rounded caps, no fill, no shading"
- Every prompt ends with the same **constraints block** — keep it; it is what
  stops ChatGPT from adding text, gradients, and backgrounds.

Coral temperatures:

- **A — orange-coral** `#FF5A3C`
- **B — pink-coral** `#FF4D6D`

Charcoal: `#1A1A1F`. Background for all prompts: plain white `#FFFFFF`.

### Constraints block (appended to every prompt)

```
Composition: a single centered icon filling about 60% of a square canvas, plain
flat white background, nothing else in frame. No text, no letters except where
the prompt says so, no wordmark, no tagline, no mockup, no phone, no border, no
container shape, no drop shadow, no gradient backgrounds, no extra decorative
elements. Exactly two colors: charcoal #1A1A1F and the coral named above, plus
white. The mark must stay legible when shrunk to 32 pixels and must work if
printed in one color. Mood: serious, energetic, trustworthy; a language-learning
brand for adults, not for children. Vector-style, clean edges, high resolution.
```

---

## 1. Ascending arc / trajectory

Upward motion as a path that has already left the ground: an orbit, a launch
curve, a sun clearing a horizon.

### 1A — arc, orange-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: an
ascending trajectory — a single sweeping arc that starts low-left, gains height
and momentum, and ends high-right with a small solid circle at its tip like a
point in motion reaching its peak. The arc is charcoal #1A1A1F; the circle at
the tip is orange-coral #FF5A3C. The curve should feel like it is accelerating,
thicker at the base and tapering slightly toward the tip.
STYLE: rendered as a smooth glossy 3D object with soft studio lighting, subtle
translucency and a single crisp highlight, no drop shadow.
[constraints block]
```

### 1B — arc, pink-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: a
rising orbit — a three-quarter elliptical arc tilted upward to the right, with a
small solid sphere sitting at its highest point as if it has just climbed there.
The arc is charcoal #1A1A1F and the sphere is pink-coral #FF4D6D. Leave the
lower-right part of the ellipse open so the shape reads as motion, not a closed
ring.
STYLE: rendered as a smooth glossy 3D object with soft studio lighting, subtle
translucency and a single crisp highlight, no drop shadow.
[constraints block]
```

---

## 2. Letterform "S" / "U" with an upward stroke

The name itself as the mark. The CamelCase "U" of StepUp is a natural upward
gesture.

### 2A — letterform, orange-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: a
custom uppercase letter "S" whose final stroke does not curl back but extends
straight upward and to the right, ending in a small arrowhead-free lift — the
letter itself becomes an ascending gesture. The body of the S is charcoal
#1A1A1F; only the extended upward tail is orange-coral #FF5A3C. Geometric,
monoline, slightly condensed, based on a geometric sans-serif skeleton.
STYLE: drawn as a single continuous thin line of uniform stroke weight, rounded
caps, no fill, no shading.
[constraints block]
```

### 2B — letterform, pink-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: the
letters "S" and "U" merged into one monogram where the right arm of the U rises
higher than the left and continues past the top of the S, so the whole shape
reads as something climbing. The S is charcoal #1A1A1F; the U is pink-coral
#FF4D6D. The two letters share one stroke where they touch. Geometric,
monoline, based on a geometric sans-serif skeleton.
STYLE: drawn as a single continuous thin line of uniform stroke weight, rounded
caps, no fill, no shading.
[constraints block]
```

---

## 3. Folding ribbon

A path that changes direction as it rises, dynamic rather than stair-like: the
"step by step" idea without the staircase.

### 3A — ribbon, orange-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: a
flat ribbon that zigzags upward in three folds, each fold turning at a sharp
diagonal so the overall silhouette is a rising diagonal, not a set of stairs.
The ribbon has visible front and back faces: the front faces are charcoal
#1A1A1F, the back faces revealed at each fold are orange-coral #FF5A3C. The top
end of the ribbon points up and slightly right, as if still moving.
STYLE: rendered as a smooth glossy 3D object with soft studio lighting, subtle
translucency and a single crisp highlight, no drop shadow.
[constraints block]
```

### 3B — ribbon, pink-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: a
single ribbon that loops once and then shoots upward, like a stroke of a
calligraphy brush that ends in a rising flick. The main body is charcoal
#1A1A1F; the final upward flick is pink-coral #FF4D6D. The loop should be
small and low, the rising stroke tall and dominant, so the eye travels up.
STYLE: rendered as a smooth glossy 3D object with soft studio lighting, subtle
translucency and a single crisp highlight, no drop shadow.
[constraints block]
```

---

## 4. Wing

Lift. Keep it abstract — one wing, not a bird — to stay away from Duolingo.

### 4A — wing, orange-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: a
single abstract wing made of three feather strokes fanning upward and to the
right, each stroke longer than the last so the wing itself reads as a rising
diagonal. The two lower strokes are charcoal #1A1A1F; the topmost, longest
stroke is orange-coral #FF5A3C. No bird body, no head, no eye — just the wing.
STYLE: drawn as a single continuous thin line of uniform stroke weight, rounded
caps, no fill, no shading.
[constraints block]
```

### 4B — wing, pink-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: an
abstract wing reduced to two curved strokes that lift from a shared point at the
bottom-left, one short and one long, with the long one sweeping up and out to
the top-right. The short stroke is charcoal #1A1A1F; the long lifting stroke is
pink-coral #FF4D6D. Should suggest lift and air, not an animal.
STYLE: drawn as a single continuous thin line of uniform stroke weight, rounded
caps, no fill, no shading.
[constraints block]
```

---

## 5. Mountain with a rising line

A goal and the route up it. Solid, trustworthy; the line supplies the energy.

### 5A — mountain, orange-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: a
simplified single mountain peak as a solid charcoal #1A1A1F triangle with one
softened corner, and a single orange-coral #FF5A3C line that starts at the
bottom-left outside the mountain, crosses in front of it on a rising diagonal,
and ends just above and to the right of the summit with a small solid dot. The
line is the hero; the mountain is the backdrop.
STYLE: rendered as a smooth glossy 3D object with soft studio lighting, subtle
translucency and a single crisp highlight, no drop shadow.
[constraints block]
```

### 5B — mountain, pink-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: two
overlapping mountain peaks, the front one lower and charcoal #1A1A1F, the back
one taller and pink-coral #FF4D6D, arranged so the two summits form a rising
diagonal from left to right. No line, no sun, no snow caps — just the two
angular shapes and the upward diagonal they create together.
STYLE: rendered as a smooth glossy 3D object with soft studio lighting, subtle
translucency and a single crisp highlight, no drop shadow.
[constraints block]
```

---

## 6. Sprout

Growth from small beginnings. Kept sharp and geometric so it does not read as
eco or kids.

### 6A — sprout, orange-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: a
geometric sprout — a single straight vertical stem rising from a short
horizontal baseline, with two leaves that are simple angular lens shapes, the
lower leaf pointing left and the higher one pointing right and upward, so the
silhouette climbs. The stem and baseline are charcoal #1A1A1F; the upper leaf
is orange-coral #FF5A3C. Sharp, architectural, not organic or cute.
STYLE: drawn as a single continuous thin line of uniform stroke weight, rounded
caps, no fill, no shading.
[constraints block]
```

### 6B — sprout, pink-coral

```
Minimal logo icon for "StepUp English", a language-learning brand. Concept: an
upward stroke that starts as a stem and splits into two diverging lines at the
top like a young shoot opening, forming a narrow "Y" that leans slightly right.
The stem is charcoal #1A1A1F; the right-hand, taller branch is pink-coral
#FF4D6D. Abstract enough to read as growth or a rising fork in a path.
STYLE: drawn as a single continuous thin line of uniform stroke weight, rounded
caps, no fill, no shading.
[constraints block]
```

---

## Later: lockup prompts (after an icon style is chosen)

Run these only for the winning family. Expect text errors in about a third of
outputs; keep the ones whose spelling is right and ignore the rest.

```
Logo lockup for "StepUp English". Left: the icon described as [paste the
winning icon description]. Right: the wordmark "StepUp" set large in a
geometric sans-serif (like Manrope), CamelCase with a capital S and capital U,
charcoal #1A1A1F; beneath it the word "English" set small in the same typeface,
letter-spaced, charcoal #1A1A1F at 60% opacity. The icon height equals the
cap height of "StepUp". Plain white background, horizontal layout, nothing
else in frame. Spell the words exactly: "StepUp" and "English".
```

Also try a stacked version (icon above the wordmark, centered) and a dark
version (background #121215, wordmark #EDEDF0, coral unchanged).
