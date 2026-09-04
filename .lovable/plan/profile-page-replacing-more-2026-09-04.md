# Profile page (replacing "More")

Rename the last bottom-tab from "More" to "Profile" and rebuild that page around the teacher, starting with a proper profile header instead of the small grey card it has today.

## Profile header

- Large avatar with initials, name in the display face, role/title underneath, institution name (Sringeri Vidya Mandir) as a quiet line.
- Email and phone shown as one small, tappable detail line.
- "Edit profile" as a subtle secondary action in the top-right of the header block.
- No bell / page top bar — the header is the top of the page.

## Identity tags

Directly under the header, still inside the same white panel:

- **My subjects** — subject chips (Physics, Chemistry, Biology, Mathematics), coloured with the existing low-chroma event tints.
- **My classes** — class chips (11 Science, 10 A, 9 B), each showing the section label; for class teachers the class they own gets a small "Class teacher" marker.
- Chips wrap, no horizontal scrolling.

Both lists come from the existing teacher/class mock data — no new data model.

## Sections below

Grouped rows, each with a small icon and a chevron, in this order:

1. **People** — Student directory (`/students`), Teacher directory (`/teachers`)
2. **Preferences** — Notification settings (`/notifications`), Appearance (light/dark toggle, stays in place), Settings (`/settings`)
3. **Support** — Help & support (`/help`), About Aarth
4. **Sign out** — kept at the bottom in red.

The long "Teaching" and "Workspace" tool lists move out of this page: those tools are already reachable from the Create sheet and the library, so the profile page stays about the person and their account. The role preview switcher stays, but tucked at the bottom of Preferences so it no longer sits near the top.

## Technical notes

- Tab label and icon in `src/components/aarth/app-shell.tsx` (`TABS`) change to "Profile" with a user icon; the route path stays `/more` so nothing else breaks, and the desktop side menu's "More" group is relabelled "Account".
- `src/routes/more.tsx` rewritten: new head title/description ("Profile — Aarth Educator"), profile header, tag rows, grouped lists, sign-out.
- Subjects/classes derived from `teachers` and `classes` in `src/data/mock.ts` for the signed-in teacher; admin roles show institution role info instead of subject tags.
- Existing tokens only (`--ev-*` tints, hairline cards, 16–22px radii, press scale). Verify with `bunx tsgo --noEmit` and a 393px screenshot check.
