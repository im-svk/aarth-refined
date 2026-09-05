# Students page redesign

Make the Students directory look premium and consistent with the rest of the app, and move student details into an overlay instead of a panel sitting under/next to the list.

## What changes on screen

**Directory (main page)**
- Clean header: "Students" with a one-line summary (total students, active classes) — no more boxed page header block on phone.
- A compact stats strip: total students, classes covered, pending invites.
- Search becomes the same circular icon that expands to a full-width field (matching the Classes page), with a Cancel action.
- Class filter chips stay, in a single swipeable row.
- Students are grouped by class with a small sticky group label, and each row shows a colour-toned initials avatar, name, roll number, subject count, an "Invited" badge when pending, and a chevron.
- Empty state and "Invite students" action (admin only) stay as they are.

**Student details**
- Tapping a student opens an overlay, not inline content.
  - Phone: a bottom sheet that slides up, with a drag handle, scrollable body and actions pinned at the bottom.
  - Desktop: a slide-over panel anchored to the right edge, full height, with a dimmed backdrop.
- Details content is redesigned: large avatar with class/roll line, status badge, quick action buttons (Message, Call, Email), contact rows, subject chips, and an invite notice when pending.
- Closing: backdrop click, close button, or Escape.

## Technical notes

- New `src/components/aarth/side-sheet.tsx`: overlay primitive — bottom sheet under `sm`, right-anchored panel (`sm:max-w-md`, full height, slide-in) at `sm+`. Reuses the existing sheet-up animation and adds a slide-in-right keyframe in `src/styles.css`.
- `src/routes/students.tsx`: replace the `lg:grid-cols-[1.2fr_1fr]` two-column layout with a single-column directory; `selectedId` becomes `selectedId | null` and drives the new overlay. `StudentDetail` is rewritten as the sheet body.
- Grouping uses the existing `classes` / `className` helpers from `src/data/mock.ts`; tone colours reuse the `ev-*` tokens and the `toneFor` hashing pattern already used on the Profile page.
- `InviteDialog` and all data/routes stay unchanged.
