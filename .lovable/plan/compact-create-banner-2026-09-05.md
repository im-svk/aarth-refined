# Compact Create Banner

Make the dashboard Create banner smaller and less bulky while keeping the swipeable slides, illustrations, and CTA.

## Changes

- Reduce overall banner height by cutting vertical padding (`p-5 pb-12` → `p-4 pb-8`).
- Shrink the illustration area (`h-24 sm:h-28` → `h-16 sm:h-20`).
- Tighten typography: eyebrow and hint slightly smaller, title reduced (`text-[1.45rem]` → `text-lg` or `text-[1.15rem]`).
- Make the CTA pill smaller (`h-9` → `h-8`, `px-4` → `px-3.5`, `mt-4` → `mt-2.5`).
- Lower the pagination dots closer to the bottom edge and keep them unobtrusive.
- Keep the rounded-3xl container, swipe gestures, auto-rotation, and slide gradients unchanged.

## Verification

- Type-check the project.
- Run a 393 px Playwright check on `/dashboard` to confirm the banner is compact and no horizontal scroll appears.