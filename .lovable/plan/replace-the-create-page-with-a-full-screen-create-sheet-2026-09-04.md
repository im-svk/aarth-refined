# Replace the Create page with a full-screen Create sheet

Today the plus button in the bottom bar opens a separate "Create Studio" page. That page goes away completely. Instead, tapping plus slides a full-height panel up from the bottom of the screen with every tool a teacher can create with, grouped into clear sections, each with its own icon and a Create / View choice.

## What the teacher sees

Tapping the centre plus button (phone) or "Create" in the side menu (desktop) opens a panel:

- Phone: slides up from the bottom and fills the screen, rounded top corners, small grab handle, close button top-right, title "Create" with a short line under it. Content scrolls; the sheet closes on tap-outside, close button, Escape, or after choosing a tool.
- Desktop: the same content as a centred large panel.

Inside, tools are grouped:

1. **AI study material** — one prominent row at the top (notes, chapter summaries, lesson plans).
2. **Assessments** — Quiz, Question paper.
3. **Class materials** — Presentation, Assignment, Notes.
4. **Planning** — Curriculum plan, Class planner.

Each tool shows a soft tinted rounded-square icon, its name, a one-line description, a small quiet label where relevant ("Best on desktop", "Plan"), a primary **Create** action and a secondary **View** link to the existing list for that tool. Locked-by-plan tools show the existing tasteful locked state instead of Create.

Below the groups, a compact **Recent** list (latest study material, quiz, presentation) so a teacher can jump straight back into work.

Loading is not needed (local data), but the sheet includes an empty state for Recent when there is nothing yet.

## Visual rules

Same design system as the rest of the app: Inter Tight headings, 16–22px radii, 1px hairlines, single-layer shadow, 120–160ms transitions, press-scale 0.98, no gradients or neon. Tool icons use the existing low-chroma `--ev-*` tint tokens, one per group so sections read apart without turning rainbow. Full light/dark support. Phone width stays 393px with no horizontal scroll.

## Technical notes

- Delete `src/routes/academic-tools.tsx`. The generated route tree updates itself; `/academic-tools` no longer exists.
- New `src/components/aarth/create-sheet.tsx` exporting `CreateSheet({ open, onClose })`, built on the existing sheet/dialog styling conventions (own implementation so it can go full-height on phone, since `ResponsiveDialog` caps body height at 64vh).
- `src/components/aarth/app-shell.tsx`: the centre `Create` tab becomes a `<button>` that toggles sheet state instead of a `Link`; the sidebar "Create Studio" item does the same. Remove `/academic-tools` from `TABS` and the sidebar nav array. Sheet state lives in `AppShell` so it works from every screen.
- Tool destinations reuse existing routes: `/aidocs`, `/quizzes`, `/papers`, `/presentations`, `/assignments`, `/notes`, `/curriculum`, `/class-planner`. "Create" navigates to the route (its own creation flow); "View" navigates to the same list — both wired through `Link`, no new routes.
- Recent items come from the existing `aiDocuments`, `quizzes`, `presentations` mock data with `relativeTime`.
- Plan gating and role checks reuse `useApp()` plus the existing `PlanGate` primitive.
- Verify with `bunx tsgo --noEmit` and a phone-width screenshot check.
