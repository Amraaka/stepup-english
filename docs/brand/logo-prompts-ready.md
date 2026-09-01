# Logo prompts — ready to paste (v2)

Ten prompts, each with concrete geometry (angles, proportions, stroke ratios) so
the model does not fill in generic shapes. Every prompt is followed by the
shared tail below. Each run returns a 2×2 sheet of four variations. Swap
`#FF5A3C` → `#FF4D6D` for pink-coral. Save keepers to
`public/brand/candidates/<family>-<a|b>-<n>.png`. See ADR 0004.

## Shared tail (append to every prompt)

Output: one image containing a 2×2 grid of four distinct variations of this
concept, each on its own plain white square, generous white margin, no labels
or numbers. Style: flat vector logo mark, professional brand identity quality,
optically balanced, consistent stroke weight, clean geometric construction on
an implied grid, crisp edges, no texture. Colors: only charcoal #1A1A1F and
coral #FF5A3C on pure white. Must read clearly at 32 px and as a single-color
silhouette. Avoid: text, letters (unless the prompt asks for one), wordmark,
tagline, globe, speech bubble, book, graduation cap, arrow icon, rocket, owl or
any animal, person, gradients, shadows, 3D bevels unless asked, container
shapes, borders, mockups, photos. Mood: serious, energetic, trustworthy — a
language-learning brand for adults, never childish.

Midjourney: replace the tail with
`--no text, letters, globe, speech bubble, book, arrow, rocket, animal, gradient, shadow, mockup --style raw --v 7`

## Prompts

1. **Ascending arc** — Logo mark for "StepUp English". Concept: a single quarter-circle arc rising from bottom-left to top-right at roughly 60° of sweep, drawn as a solid stroke whose width tapers from thick at the base to about 60% at the tip, so it reads as acceleration. A solid circle sits just beyond the tip, its diameter about 1.5× the base stroke width, slightly detached from the arc. Arc in charcoal #1A1A1F, circle in coral #FF5A3C. Proportions: the whole mark fits a square; the circle occupies the top-right corner of that square.

2. **Letter S with a rising tail** — Logo mark for "StepUp English". Concept: a custom geometric capital S built from two equal semicircles on a monoline stroke with rounded terminals. Its lower terminal does not curl inward: it leaves the curve as a straight 45° diagonal rising up-right, extending past the top of the S, and ends in a small solid dot. S body in charcoal #1A1A1F; the diagonal tail and dot in coral #FF5A3C. Stroke width about 1/7 of the letter height. The tail should feel like a deliberate lift, not a flourish.

3. **SU monogram** — Logo mark for "StepUp English". Concept: a monogram of S and U built on the same geometric sans-serif skeleton. The S sits lower-left in charcoal #1A1A1F; the U sits upper-right in coral #FF5A3C, overlapping the S's top curve by one stroke width so they share a single continuous line. The U's right arm rises about 30% taller than its left arm, tilting the whole mark upward. Bold solid strokes, stroke width about 1/5 of the letter height, rounded or flat terminals consistent throughout.

4. **Folding ribbon** — Logo mark for "StepUp English". Concept: one flat ribbon of constant width zigzagging upward in three folds along a 45° rising diagonal. Each fold is a sharp mitred turn; the ribbon travels right, folds back on itself, and continues, so the silhouette is a diagonal band, not steps. The visible front faces are charcoal #1A1A1F; at each fold the reverse face is exposed as a small triangle in coral #FF5A3C. The top end is cut at an angle pointing up-right. Flat 2D construction with no shading.

5. **Calligraphic lift** — Logo mark for "StepUp English". Concept: a single continuous stroke shaped like a brush gesture: it enters from the left, makes one small closed loop low in the mark (loop diameter about 1/4 of the mark height), and exits into a long straight diagonal rising to the top-right, ending in a tapered point. The loop and the first half of the stroke are charcoal #1A1A1F; the stroke turns coral #FF5A3C partway up the diagonal with a clean straight color break, not a gradient. Stroke width tapers from thick at the loop to thin at the tip.

6. **Abstract wing** — Logo mark for "StepUp English". Concept: two curved strokes sharing one origin point at the bottom-left, fanning up-right like a stylised wing. The lower stroke is short, ending at about 40% of the mark width; the upper stroke is long, sweeping to the top-right corner. Both are monoline with rounded ends and the same stroke width, and the gap between them widens as they rise. Lower stroke charcoal #1A1A1F, upper stroke coral #FF5A3C. No bird body, head, eye, or feathers — two lines only.

7. **Two peaks** — Logo mark for "StepUp English". Concept: two triangles side by side, overlapping by about a third. The front triangle is lower, wider, and charcoal #1A1A1F; the rear triangle is taller, narrower, and coral #FF5A3C, positioned to the right so the two apexes form a rising line at roughly 30°. Where they overlap, the front triangle simply covers the rear one — no outlines, no transparency. Apexes are sharp or very slightly rounded, bases aligned on one baseline. Solid flat fills.

8. **Rising orbit** — Logo mark for "StepUp English". Concept: an elliptical ring tilted about 30° so its long axis rises to the right, drawn as a monoline stroke, with a gap of about 60° cut out of the lower-right so it reads as motion rather than a closed loop. A solid circle sits exactly on the ring at its highest point, diameter about 2× the ring's stroke width. Ring in charcoal #1A1A1F, circle in coral #FF5A3C. Flat 2D, no shading.

9. **Geometric sprout** — Logo mark for "StepUp English". Concept: a short horizontal baseline, a vertical stem rising from its centre to about 80% of the mark height, and two leaves that are angular pointed ovals (like elongated rhombuses), not organic shapes. The lower leaf branches left at 45° from the stem's midpoint; the upper leaf branches right at 45° from near the top and is about 1.5× the size of the lower one. Baseline, stem, and lower leaf in charcoal #1A1A1F; upper leaf in coral #FF5A3C. Sharp, architectural, minimal.

10. **Accelerating dots** — Logo mark for "StepUp English". Concept: four solid circles arranged along a straight 45° diagonal from bottom-left to top-right. Each circle is about 1.4× the diameter of the previous one, and the spacing between circles grows by the same ratio, so the sequence reads as acceleration. The first three circles are charcoal #1A1A1F; the fourth and largest, at the top-right, is coral #FF5A3C. Circles do not touch. Perfectly geometric, flat fills, nothing else.

## Working method

- Generate the 2×2 sheet, then iterate on one cell ("refine variation 3: stroke
  20% thinner, dot larger") rather than regenerating from scratch.
- When one is close, ask for "the same mark as a clean black-and-white version"
  to confirm it survives as a silhouette before judging the color.
- Want the glossy-3D or thin-line looks from `logo-prompts.md`? Replace the
  "Style:" sentence in the tail with the matching STYLE line from that file.
