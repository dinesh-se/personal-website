# Task T-001: Per-Route Loading and Error Pages

## Goal

Create per-route `loading.tsx` (skeleton loaders) and `error.tsx` (hybrid error pages) for all 5 routes to enable streaming, Suspense boundaries, and custom error UI.

## Background

The current codebase has no `loading.tsx` or `error.tsx` files in any route. The proposal specifies:

- Per-route `loading.tsx` with skeleton loaders for each route
- Root-level `error.tsx` as catch-all fallback
- Route-specific `error.tsx` files for key routes (hybrid pattern)
- All error pages use skeleton-based fallback UI consistent with the loading state pattern

The architecture document (§5 Error Handling) confirms the hybrid pattern: root `error.tsx` as catch-all, route-specific `error.tsx` for key routes.

## Scope

### Files to Create

1. `src/app/loading.tsx` — Root-level skeleton loader (applies to all routes via layout)
2. `src/app/error.tsx` — Root-level error catch-all (skeleton-based fallback UI)
3. `src/app/about/loading.tsx` — About page skeleton loader
4. `src/app/about/error.tsx` — About page error page
5. `src/app/projects/loading.tsx` — Projects page skeleton loader
6. `src/app/projects/error.tsx` — Projects page error page
7. `src/app/blog/loading.tsx` — Blog page skeleton loader
8. `src/app/blog/error.tsx` — Blog page error page
9. `src/app/uses/loading.tsx` — Uses page skeleton loader
10. `src/app/uses/error.tsx` — Uses page error page

### Files to NOT Modify

- All existing `page.tsx` files (data fetching already uses `"use cache"`)
- All existing component files
- `src/app/layout.tsx` (no changes needed — no Suspense boundaries required per proposal)

## Acceptance Criteria

> ✅ Verified 2026-07-19

- [x] Root `loading.tsx` exists and renders skeleton placeholders matching the root layout structure
- [x] Root `error.tsx` exists, catches all unhandled errors, and renders skeleton-based fallback UI
- [x] Each of the 5 route directories (`about/`, `blog/`, `projects/`, `uses/`) has its own `loading.tsx` with skeleton loaders matching the page layout
- [x] Each of the 5 route directories has its own `error.tsx` with error UI consistent with the skeleton loading pattern
- [x] All skeleton loaders visually match the corresponding page layout (same structure, placeholder shapes/sizes)
- [x] All error pages display a user-friendly message and a link to navigate back home
- [x] `npm run build` completes with zero TypeScript errors and zero ESLint errors
- [x] `npm test` — all 8 Jest snapshot tests pass
- [x] `npm run lint` — zero ESLint errors
- [x] `npm run typecheck` — zero TypeScript errors
- [x] `npx playwright test` — all 9 E2E tests pass
- [x] All 5 pages render correctly in both light and dark modes
- [x] Dark mode styles apply correctly on all pages via system preference toggle
- [x] The mobile navigation menu opens and closes correctly on a mobile viewport width
- [x] The active navigation link is highlighted in both Header and Footer when on any page
- [x] All five pages render without runtime errors when visiting each route in a browser
- [x] The production build succeeds with zero TypeScript and zero ESLint errors
- [x] The CI workflow runs on Node 24 and passes lint and test steps
- [x] No visual changes to existing UI components — only new loading/error files added

## Implementation Notes

### Skeleton Loader Design

- Use the same Tailwind classes as the existing page layouts (same grid/flex structure)
- Replace dynamic content with colored placeholder blocks (`bg-gray-200 dark:bg-gray-700 rounded`)
- Match dimensions to the actual content they replace (e.g., project cards, blog cards, experience items)
- Keep it minimal — the goal is to show the page structure during streaming, not a polished loading state

### Error Page Design

- Root `error.tsx`: Generic error message with "Go Home" link, skeleton-based layout
- Route `error.tsx`: Route-specific error message (e.g., "Failed to load blog posts") with "Go Home" link
- Both use skeleton-based fallback UI (consistent with loading state pattern per proposal)
- Both include `revalidate` to allow retry on next request

### Key Constraints

- No changes to existing page components or data fetching
- No new dependencies
- All files must follow existing project conventions (TypeScript strict mode, path aliases, import ordering)
- Error pages must use `next/navigation` for the "Go Home" link (not `<a>` tags)

## User test

Run `npm run dev`, visit each route (`/`, `/about`, `/projects`, `/blog`, `/uses`) and verify skeleton loaders appear during initial paint. Force an error on one route (temporarily break its data fetch), verify the route-specific error.tsx renders with skeleton fallback UI. Restore the page and confirm normal operation resumes. Run `npm test`, `npm run lint`, `npm run build`, `npm run typecheck`, and `npx playwright test` — all must pass. Visit each page in a browser and verify all 5 pages render correctly in both light and dark modes. Toggle system dark mode and verify styles apply correctly. On a mobile viewport width, verify the hamburger menu opens and closes. Verify the active navigation link is highlighted in both Header and Footer.

## Traceability

- **PRD**: FR-13 (all 5 pages render without runtime errors), FR-14 (mobile menu), FR-15 (nav active state), FR-16 (dark mode)
- **Proposal**: "Per-route loading.tsx", "Per-route error.tsx (hybrid)", "No visual changes"
- **Architecture**: §5 Error Handling (hybrid pattern), §2 Folder Structure (new loading.tsx/error.tsx files)
- **UX Spec**: §1 Screen Inventory (skeleton loaders must match page layout), §4 Screen Specs (responsive behavior)

## Review findings

Open — the reviewer flagged these:

- **note** `src/app/uses/loading.tsx` — Line 13: The span skeleton placeholder has `text-2xl` class that is dead code — spans don't render text content and this class has no visual effect. Harmless but should be removed for cleanliness.
- **note** `src/app/error.tsx (and all route error.tsx files)` — Implementation notes state error pages should include `revalidate` to allow retry on next request, but all error pages only use `reset` via `({ reset }: { reset: () => void })`. In Next.js App Router, `reset` provides equivalent retry functionality (attempts to rerender the segment), so this is not a functional issue — the implementation notes were aspirational rather than a hard requirement.
- **note** `task acceptance criteria` — The task claims 'all 8 Jest snapshot tests pass' and 'all 9 E2E tests pass', but the actual test suite has 39 Jest tests (10 suites, 15 snapshots) and 20+ E2E tests across 9 spec files. The acceptance criterion counts are outdated; the actual test coverage is more comprehensive than stated.

Addressed during review — raised, then fixed before the task committed:

- **critical** `src/app/about/loading.tsx:21` — Uses `h-90 w-90` on line 21 which are NOT valid Tailwind CSS classes. The default Tailwind spacing scale jumps from 80 (20rem) to 96 (24rem) — there is no 90. The build passes because Tailwind only strips unused classes from CSS output, not from HTML attributes. The skeleton image placeholder collapses to 0×0 and is invisible, so the loading skeleton does NOT visually match the About page layout (which uses a 360×360 image). Should use `h-[360px] w-[360px]` or `h-96 w-96`. (raised round 1)
