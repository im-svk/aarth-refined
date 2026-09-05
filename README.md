# Aarth: Refined

You are redesigning the UI of an existing production app called "Aarth Educator" — an

  AI-powered teaching platform (a lightweight LMS + AI content studio) used by school/college

  educators in India. I've attached a full product spec (AARTH_EDUCATOR_UI_SPEC.md) describing

  every screen and feature. Read it fully. Your job is a COMPLETE visual/UX revamp into ONE

  coherent, premium design system — do not change the features, data, or routes, only the design.

  

  ════════════════════════════════════════

  GOAL

  ════════════════════════════════════════

  The current app looks unprofessional because it has three half-finished, clashing styles.

  Replace all of it with a single, consistent, editorial, premium design language applied from

  the login screen through every one of the ~30 screens (desktop + phone). Think Linear / Notion

  restraint with a warm editorial touch. It must feel like a trustworthy academic tool, NOT a

  childish gamified EdTech app.

  

  ════════════════════════════════════════

  DESIGN SYSTEM (use exactly, define as tokens)

  ════════════════════════════════════════

  • Accent: a SINGLE academic indigo — #4338CA (light) / #A5B4FC (dark). No second brand color.

  • Neutrals: off-white page #F7F8FA, white cards #FFFFFF, ink #17181D, muted text #5B6472,

    hairline borders #E8E9EE. Full dark mode required (deep neutral blue-gray, indigo lightens).

  • Typography:

       tight letter-spacing. Editorial.

     – All UI text: Inter / Plus Jakarta Sans.

  • Surfaces: FLAT. Hairline 1px borders, soft SINGLE-layer shadows, 16–22px corner radii,

    generous consistent spacing. 

  • STRICT: NO gradients, NO neon, NO rainbow category colors, NO cartoon illustrations, NO

    glI  colored badges. Subject/class "colors" appear ONLY as a thin 2px accent bar or a soft

    low-chroma tinted chip for wayfinding — never as filled gradient tiles.

  • Motion: subtle. 120–160ms ease transitions, a light press-scale (0.98) on tappable cards.

  

  ════════════════════════════════════════

  REUSABLE COMPONENTS (build once, use everywhere)

  ════════════════════════════════════════

  App shell (sidebar + phone bottom-tabs), top bar, PageHeader (kicker + serif title + subtitle),

  SectionHeader (title + "view all"), Card, ListRow (icon + title + subtitle + trailing chevron),

  StatTile, ClassCard, PersonRow/Avatar, SearchField, FilterChips, SegmentedToggle, EmptyState

  (soft icon chip + serif title + muted line + one CTA), Loading spinner + subtle skeletons,

  Button (primary indigo / ghost), IconButton, FloatingActionButton, Dialog (desktop) / BottomSheet

  with drag handle (phone), Badge/Pill (muted, low-chroma).

  

  ════════════════════════════════════════

  GLOBAL LAYOUT

  ════════════════════════════════════════

  Desktop (≥768px): collapsible left SIDEBAR grouped as Workspace / Teach / Library / People / More

  (see spec §4), with institution logo header + admin "Create New Class" button, and a footer with

  avatar/name/email/settings/sign-out + dark-mode toggle. Thin top bar: search, notifications, avatar.

  

  Phone (<768px): native app feel. Top bar (back/avatar, centered title, notifications bell).

  Bottom tab bar of 5: Home · Classes · CREATE (center, elevated) · Library · More. The CREATE tab

  opens the "Create Studio" screen. "More" opens a full-screen grouped menu. Respect safe-area 

  insets and 44px minimum tap targets.

  

  ════════════════════════════════════════

  SCREENS TO REDESIGN (detail in the attached spec, §6)

  ════════════════════════════════════════

  Auth/Login, Reset Password, Institution Registration (with 4:1 logo-crop dialog + Turnstile),

  Onboarding, Home (separate Teacher + Admin dashboards), Classes (+ create/edit dialog),

  Class Workspace (tabs: Curriculum/Students/Teachers), Subject Workspace (modules), Library/Content

  (Files + Textbooks tabs), AI Study Material studio (gallery + AI wizard + A4 editor), Quizzes

  (library + composer + editor + share code), Question Papers (multi-step generate→preview→evaluate→

  gradebook), Presentations (gallery + slide editor), Notes, Create Studio (the central launcher —

  context chips + grouped-by-outcome cards + recent creations), Academic Textbooks (browse + import),

  Curriculum, Teacher Calendar (month view), Class Planner (+ 2-step wizard), Planner Detail, Subject

  Planner (chapters + timeline), Students (two-pane directory + invite flows), Teachers (table +

  assignment dialog), Analytics (KPI tiles + charts), Notifications (compose + inbox), Settings

  (profile + branding + theme), Help (tickets), Class Invite Join (public student page), 404.

  

  Highlight quality on: (1) the Create Studio, (2) both Home dashboards, (3) the AI generate→preview→

  edit flows, (4) the directories with their filters/empty states.

  

  ════════════════════════════════════════

  IMPORTANT RULES

  ════════════════════════════════════════

  • Role-aware UI: super_admin / admin / teacher see different actions (spec notes which).

  • Plan-gated screens (Assignments, Class Planner, Analytics) need a tasteful "Not enabled on your

    plan" locked/upgrade state — not a broken page. 

  • Some editors (quiz editor, paper builder, slide editor, A4 doc editor) are desktop-optimized;

    on phone show a clean "best on desktop" affordance but still allow browse/preview.

  • Keep the domain accurate for mock content: Indian K-12, boards CBSE/NCERT + Karnataka State

    (KTBS), grades 8–12, Class 11/12 streams Science/Commerce/Arts, NCERT subjects, Indian names,

    IST timezone, en-IN dates. 

  • IGNORE all files/screens flagged legacy in the spec (students/*, classes/*, assignments/*,

    Educator* pages) — do not design them.

  • Every screen must have proper loading, empty, and error states matching the conventions above.

  

  Deliver a cohesive design system + all screens above, desktop and mobile, light and dark.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5680cfa4-b2e9-4121-9b2b-97e5d445060d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
