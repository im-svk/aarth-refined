# Aarth Educator — Unified UI Redesign

Build the full redesigned interface fresh in this project from the attached spec: one coherent "Refined Slate" design language, all screens desktop + phone, light + dark, with realistic Indian K-12 mock data and no backend. Components and tokens are written to be portable into the production app.

## Design system (built first, used everywhere)

- Single accent: academic indigo `#4338CA` light / `#A5B4FC` dark. No second brand colour.
- Neutrals: page `#F7F8FA`, cards `#FFFFFF`, ink `#17181D`, muted `#5B6472`, hairline borders `#E8E9EE`. Full dark mode in deep neutral blue-gray.
- Type: Instrument Serif for display/greeting titles (italic-capable, tight tracking), Plus Jakarta Sans for all UI text.
- Surfaces: flat, 1px hairline borders, single-layer soft shadow, 16–22px radii, generous consistent spacing.
- Forbidden: gradients, neon, rainbow category colours, cartoon illustrations, loud badges. Subject/class colour = 2px accent bar or low-chroma tinted chip only.
- Motion: 120–160ms ease transitions, 0.98 press-scale on tappable cards.

## Component library (build once)

App shell (desktop sidebar + phone bottom tabs), top bar, PageHeader (kicker + serif title + subtitle), SectionHeader with "view all", Card, ListRow, StatTile, ClassCard, PersonRow/Avatar, SearchField, FilterChips, SegmentedToggle, EmptyState, Spinner + skeletons, Button (primary/ghost), IconButton, FAB, Dialog (desktop) / BottomSheet with drag handle (phone), muted Badge/Pill, PlanGate ("Not enabled on your plan") and DesktopOnly ("best on desktop") states.

## Shell

- Desktop (≥768px): collapsible sidebar grouped Workspace / Teach / Library / People / More, institution logo header + admin "Create New Class", footer with avatar/name/email/settings/sign-out + dark-mode toggle; thin top bar with search, notifications, avatar.
- Phone (<768px): top bar (back/avatar, centered title, bell), 5 bottom tabs — Home · Classes · CREATE (elevated centre) · Library · More; More is a full-screen grouped menu. Safe-area insets, 44px tap targets.
- A role switcher (super_admin / admin / teacher) so role-aware UI is reviewable without auth.

## Phases

**Phase 1 — foundation + flagships**
Tokens, dark mode, component library, both shells, Auth, Reset Password, Institution Registration (4:1 logo crop dialog + Turnstile placeholder), Onboarding, Teacher Home, Admin Home, Create Studio (`/academic-tools`), 404.

**Phase 2 — classes + library**
Classes list (+ create/edit dialog with live preview), Class Workspace tabs, Subject Workspace, Library/Content (Files + Textbooks), Academic Textbooks, Notes, Curriculum.

**Phase 3 — AI studios**
AI Study Material (gallery → AI wizard → A4 editor), Quizzes (library → composer → editor → preview/share/results), Question Papers (library → templates → configure → generating → preview → evaluate/OMR → gradebook), Presentations (gallery → slide editor), Assignments with plan-gated locked state.

**Phase 4 — people, planning, admin**
Students (two-pane directory + invite flows), Teachers (table + assignment dialog), Calendar (month), Class Planner + wizard, Planner Detail, Subject Planner (chapters + timeline), Analytics (plan-gated KPI tiles + charts), Notifications, Settings, Help, Class Invite Join.

Each screen ships loading, empty, and error states per the spec conventions.

## Technical notes

- TanStack Start file routes matching the spec route map (`/auth`, `/dashboard`, `/classes/$classId`, `/class-planner/$classId/plan/$subjectId`, etc.); `/` renders the login screen as specced. Route files created alongside every link.
- Tokens in `src/styles.css` via `@theme inline` in oklch; fonts loaded with `<link>` in `__root.tsx`.
- Mock data in typed modules under `src/data/` (Indian names, CBSE/NCERT + KTBS, grades 8–12, streams, NCERT subjects, IST / en-IN formatting) so it can be swapped for real queries later.
- Reusable primitives in `src/components/aarth/`, shadcn/ui restyled to the tokens, framer-motion-style transitions kept subtle.
- Legacy spec areas (students/*, classes/*, assignments/* legacy pages, Educator* pages) are ignored.
- Per-route `head()` metadata; no auth/database work.
