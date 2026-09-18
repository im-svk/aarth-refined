# Plan: Simplify Aarth Educator into a Notes AI-style teaching app

## Goal
Revamp the app into a clean, simple, premium workspace focused only on:
- Teacher login through a university invite code
- Teacher profiles connected to one university
- Notes library
- AI study material
- Student view through a shared class code link

The app should feel closer to Notes AI: calm, direct, easy to understand, and not overloaded with extra school-management features.

## Product direction
- Replace the current broad LMS feel with a focused notes-and-study-material product.
- Keep the first screen simple: teacher enters invite code, then signs in or creates an account.
- After login, teachers land in a clean workspace showing their notes, study material drafts, and sharing code.
- Students use a shared class code/link to view the notes intended for their class.
- Remove or hide unrelated sections from the main experience: dashboard extras, quizzes, calendar, analytics, students directory, papers, presentations, and profile-heavy menus.

## New core screens

### 1. Invite-code entry
- Minimal welcome screen with strong branding and a professional SVG illustration.
- Teacher enters their unique code.
- The code connects the teacher to one university.
- If valid, continue to sign in/sign up.
- If invalid, show a clear error state.

### 2. Teacher sign-in and profile setup
- Simple login flow after code verification.
- Store teacher profile data: name, university, subjects, avatar/initials, and connected code.
- First-time teachers complete a short profile setup.
- Returning teachers go directly to the workspace.

### 3. Teacher workspace
- A simple home page with only the useful actions:
  - Create note
  - Upload note
  - Generate study material with AI
  - Share class code/link
- Show recent notes and recent AI study material drafts.
- Use clean cards, compact rows, professional SVG icons, and fewer visual distractions.

### 4. Notes library
- Notes grouped by subject and class.
- Search and filter should stay simple.
- Teacher can create, edit, upload, and share notes.
- Notes can be marked as shared so students can see them through the class code.

### 5. AI study material
- Keep this as a focused creation flow.
- Teacher chooses subject/class and gives instructions.
- Generated material becomes editable and can be saved to the notes library.
- Use the same visual language as the notes workspace.

### 6. Student class-code view
- Public student-facing page where students enter or open a class code.
- Shows shared notes for that class/university only.
- Clean read-only layout: subject sections, note cards, file/download/view actions.
- No teacher-only controls.

## Visual/UX direction
- Professional, simple, light workspace design.
- Clean white surfaces, soft blue accents, polished SVG illustrations, and clear hierarchy.
- Fewer tabs, fewer menu items, less clutter.
- Mobile-first layouts with no crowded bottom navigation in focused pages.
- Icons should match the existing professional Create/Workspace SVG icon style.
- The main experience should feel like a notes product, not a full LMS dashboard.

## Data and backend plan
- Enable Lovable Cloud during implementation because login, profiles, invite codes, notes, and sharing need secure storage.
- Add tables for:
  - Universities
  - Teacher invite codes
  - Teacher profiles
  - Classes or class groups
  - Subjects
  - Notes/materials
  - Shared note visibility by class code
- Add secure access rules so teachers only manage their own university/class content.
- Student code pages only read notes explicitly shared for that class code.

## Implementation phases

### Phase 1: Foundation
- Enable Lovable Cloud.
- Add email authentication and invite-code verification.
- Create the teacher profile and university-code data model.
- Replace the current entry/login flow with invite-code-first onboarding.

### Phase 2: New simplified app shell
- Replace the broad navigation with a minimal Notes AI-style structure.
- Keep only teacher workspace, notes, AI study material, and sharing/student view.
- Remove unrelated items from the visible experience.

### Phase 3: Notes and AI material workflow
- Rebuild notes and AI study material screens into one coherent product flow.
- Add create/edit/upload/save/share states.
- Make saved AI material appear in the notes workspace.

### Phase 4: Student sharing
- Build the class-code student page.
- Show only shared notes for the matching code.
- Add clean empty/error states for invalid codes or no shared notes.

### Phase 5: Polish and verification
- Check phone and desktop layouts.
- Verify login, profile setup, code-based access, note sharing, and student read-only access.
- Make final visual pass for spacing, icons, typography, and empty states.

## Out of scope unless requested
- Quizzes
- Calendar
- Student directory management
- Analytics
- Full LMS classroom administration
- Payments
- Parent accounts
