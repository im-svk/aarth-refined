# Redesign the Create pop-up

Make the panel that slides up from the plus button feel like a real, premium app screen instead of a list of buttons.

## What changes

1. **Remove the "Recent" section entirely** from the pop-up.
2. **Remove the "View" and "Create" buttons** from every tool. Each tool becomes one tappable row with a single chevron arrow on the right that opens that tool's page directly.
3. **Redesign the whole pop-up** on phone:
   - A hero tile at the top for AI study material: larger tinted panel, big icon, two-line label, and a short "Most used" marker — clearly the primary action.
   - The remaining tools become a **2-column tile grid** rather than plain rows: each tile has a coloured rounded icon square, the tool name, one short supporting line, and the arrow in the corner. Locked tools keep a quiet lock chip instead of the arrow.
   - Section headers become smaller and lighter, with more breathing room between groups.
   - Grab handle, rounded 28px top corners, softer scrim, slightly springier slide-up.
   - Desktop keeps the same content in a centred dialog, with the grid at 3 columns.
4. Keep every route, tool and permission exactly as today (Assignment and Class planner stay plan-locked).

## Technical notes

- Only `src/components/aarth/create-sheet.tsx` changes; `GROUPS` stays but each tool renders as a `Link` tile.
- Drop the now-unused `aiDocuments` / `quizzes` / `presentations` / `EmptyState` / `relativeTime` imports.
- Tile colours use the existing `--ev-1..5` / `--ev-*-bg` tokens; no new colours, no gradients.
- Verify with `bunx tsgo --noEmit` and a 393px phone screenshot (scrollWidth must stay 393).
