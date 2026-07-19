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

- [ ] Root `loading.tsx` exists and renders skeleton placeholders matching the root layout structure
- [ ] Root `error.tsx` exists, catches all unhandled errors, and renders skeleton-based fallback UI
- [ ] Each of the 5 route directories (`about/`, `blog/`, `projects/`, `uses/`) has its own `loading.tsx` with skeleton loaders matching the page layout
- [ ] Each of the 5 route directories has its own `error.tsx` with error UI consistent with the skeleton loading pattern
- [ ] All skeleton loaders visually match the corresponding page layout (same structure, placeholder shapes/sizes)
- [ ] All error pages display a user-friendly message and a link to navigate back home
- [ ] `npm run build` completes with zero TypeScript errors and zero ESLint errors
- [ ] `npm test` — all 8 Jest snapshot tests pass
- [ ] `npm run lint` — zero ESLint errors
- [ ] `npm run typecheck` — zero TypeScript errors
- [ ] `npx playwright test` — all 9 E2E tests pass
- [ ] All 5 pages render correctly in both light and dark modes
- [ ] Dark mode styles apply correctly on all pages via system preference toggle
- [ ] The mobile navigation menu opens and closes correctly on a mobile viewport width
- [ ] The active navigation link is highlighted in both Header and Footer when on any page
- [ ] All five pages render without runtime errors when visiting each route in a browser
- [ ] The production build succeeds with zero TypeScript and zero ESLint errors
- [ ] The CI workflow runs on Node 24 and passes lint and test steps
- [ ] No visual changes to existing UI components — only new loading/error files added

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
