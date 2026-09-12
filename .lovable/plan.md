# Plan: Redesign AI Docs Hero Card

## Goal
Replace the current `/aidocs` hero banner — which contains an SVG illustration — with a cleaner, more professional card focused on the "Create classroom-ready study material" call-to-action.

## Current state
- `src/routes/aidocs.tsx` renders a hero section with `StudyMaterialHeroArt` on the right.
- The illustration is visually busy and the user wants it removed.
- The hero text reads "Create classroom-ready study material." with a subline and "Create material" button.

## Changes
1. **Remove the SVG illustration**
   - Drop `<StudyMaterialHeroArt />` from the hero in `src/routes/aidocs.tsx`.
   - Remove the unused `StudyMaterialHeroArt` import.

2. **Redesign the hero card**
   - Convert the hero into a single, compact, card-style banner.
   - Keep the heading "Create classroom-ready study material." and subline "Notes, summaries and lesson plans from any chapter."
   - Promote the primary CTA "Create material" with a Sparkles icon.
   - Add subtle visual interest without an illustration: soft gradient background, rounded corners, and a clean layout.
   - Ensure the card works well on mobile (current viewport 393px) and desktop.

3. **Responsive behavior**
   - Mobile: stacked layout with heading, subline, and CTA; no side image.
   - Desktop: optional wider layout with text on one side and a soft gradient/accent on the other, still no SVG.

4. **Cleanup**
   - Remove `StudyMaterialHeroArt` export from `src/components/aarth/study-material-art.tsx` if it becomes unused, or leave it if other routes use it.

## Verification
- Run `bunx tsgo --noEmit -p tsconfig.json` to confirm no type errors.
- Capture Playwright screenshots at 393×852 and 1280×1800 to confirm the card renders cleanly with no overflow or console errors.
