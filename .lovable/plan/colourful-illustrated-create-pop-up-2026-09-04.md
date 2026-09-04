# Colourful, illustrated Create pop-up

Drop the big AI study material panel at the top and treat every tool equally inside categories, with richer illustrated icons instead of thin line glyphs.

## What changes

1. **Remove the hero panel.** "AI study material" becomes a normal tile inside a new first category.
2. **Categories** (each with a short helper line on the right):
   - **AI study tools** — AI study material, Curriculum plan
   - **Assessments** — Quiz, Question paper
   - **Class materials** — Presentation, Assignment, Note
   - **Planning** — Class planner
3. **Illustrated icons.** Each tool gets its own hand-built mini illustration (a small multi-shape SVG, roughly 40x40, drawn inside the tile's rounded tile): a paper sheet with sparkles for study material, a clipboard with ticks and a colour bubble for Quiz, a stacked exam sheet with a marks grid, a slide screen with a bar chart, a folder with layered pages, a calendar grid with a highlighted week, a compass/route line for curriculum. Each uses 2–3 tones from one colour family plus a warm accent, so tiles read colourful and playful but still coherent.
4. **Colour per tool, not per category.** Tiles get a soft tinted icon plate from the existing `--ev-1..5` palette family, cycling so neighbouring tiles differ; card body stays white with a hairline border, so the colour lives in the artwork.
5. Tiles keep the current shape: icon plate, name, one short line, arrow in the corner; locked tools keep the quiet lock. Two per row on phone, three on desktop. Routes and permissions unchanged.

## Technical notes

- Work stays in `src/components/aarth/create-sheet.tsx`; add a small local set of inline SVG illustration components (no new dependency, `currentColor` plus token-driven fills via CSS variables).
- Illustration fills use `var(--ev-N)` / `var(--ev-N-bg)` and `--ev-4` as the warm accent — no gradients, no neon.
- Verify with `bunx tsgo --noEmit` and a 393px phone screenshot (scrollWidth stays 393).
