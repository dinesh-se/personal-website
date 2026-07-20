# Task T-004: Partial Prerendering and Typed Routes

## Goal

Enable Partial Prerendering (PPR) in `next.config.mjs` and adopt Next.js 16 typed routes pattern to complete the migration to Next.js 16 App Router standards.

## Background

The current `next.config.mjs` has `cacheComponents: true` but no PPR configuration. The proposal specifies enabling PPR alongside existing ISR to stream the static shell on first paint while allowing per-segment revalidation of cached remote data.

### Current next.config.mjs

```javascript
const nextConfig = {
	reactStrictMode: true,
	cacheComponents: true,
	// ... webpack and images config
};
```

### Target next.config.mjs

```javascript
const nextConfig = {
	reactStrictMode: true,
	cacheComponents: true,
	experimental: {
		ppr: 'incremental',
	},
	// ... webpack and images config
};
```

Typed routes in Next.js 16 provide compile-time type checking for route parameters, search params, and layout props. This feature improves developer experience and catches route-related errors at build time.

## Scope

### Files to Modify

1. `next.config.mjs` — Add `experimental.ppr: 'incremental'` configuration

### Files to Review (no changes required if typed routes are not applicable)

- All route `page.tsx` files — check if typed routes patterns apply
- `src/app/layout.tsx` — check if typed layout props apply

### Files to NOT Modify

- All existing component files
- Data fetching logic
- Page JSX structure

## Acceptance Criteria

> ⏭️ Skipped 2026-07-19

- [ ] `next.config.mjs` has `experimental.ppr: 'incremental'` enabled
- [ ] `npm run build` completes with zero TypeScript errors and zero ESLint errors
- [ ] `npm run build` output shows PPR is active (check build logs for PPR-related output)
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
- [ ] No visual changes to existing UI components — only PPR configuration is added

## Implementation Notes

### PPR Configuration

- Set `experimental.ppr: 'incremental'` in `next.config.mjs`
- PPR works alongside `"use cache"` directives already in place
- Static routes (no dynamic data) are prerendered fully
- Routes with cached remote data (Hygraph, Dev.to) use incremental prerendering

### Typed Routes

- Next.js 16 typed routes may require type imports in page/layout files
- For this static site with no route parameters, typed routes may not add significant value
- Check if any route files need type annotations for `params`, `searchParams`, or `props`

### Key Constraints

- PPR is an experimental feature in Next.js 16 — verify it works with the current `"use cache"` setup
- No changes to data fetching patterns
- No new dependencies
- Must follow existing project conventions

## User test

Run `npm run build` — verify zero errors and that the build output shows PPR is active (check build logs for PPR-related output). Run `npm test`, `npm run lint`, `npm run typecheck` — all pass. Visit each route in a browser and verify all 5 pages render correctly in both light and dark modes. Toggle system dark mode and verify styles apply correctly. On a mobile viewport width, verify the hamburger menu opens and closes. Verify the active navigation link is highlighted in both Header and Footer.

## Traceability

- **PRD**: FR-13 (all 5 pages render without runtime errors), FR-16 (dark mode), FR-14 (mobile menu), FR-15 (nav active state)
- **Proposal**: "Partial Prerendering (PPR)", "Enable PPR alongside existing ISR to stream the static shell on first paint while allowing per-segment revalidation of cached remote data"
- **Architecture**: §3 Data Flow (ISR + PPR), §7 Deployment Topology
- **UX Spec**: §1 Screen Inventory (loading behavior with PPR streaming)

## Review findings

Open — the reviewer flagged these:

- **critical** `next.config.mjs` — The primary deliverable was never implemented: `experimental.ppr: 'incremental'` is NOT present in next.config.mjs. The file only has `cacheComponents: true` and no PPR configuration whatsoever. The build output confirms PPR is not active (shows 'Cache Components enabled' but no PPR mention).
- **critical** `e2e/t-008-ppr-typed-routes.spec.ts` — The E2E test contains a false claim and asserts the WRONG thing. It asserts `expect(config).not.toContain('ppr')` with the comment 'In Next.js 16.3.0-preview.6, experimental.ppr was merged into cacheComponents.' This is demonstrably false — Next.js 16.3.0-preview.6 source code (node_modules/next/dist/server/config-shared.d.ts) confirms `ppr` is a separate experimental config option with type `ExperimentalPPRConfig = boolean | 'incremental'`. The test validates that PPR was NOT added, which is the opposite of what the task requires.
- **critical** `e2e/t-008-ppr-typed-routes.spec.ts` — Test at line 24-25 asserts `expect(config).not.toContain('ppr')`, explicitly validating that no PPR configuration exists. This test would pass even if the implementation is completely missing, providing zero coverage of the actual requirement.
- **warning** `e2e/t-008-ppr-typed-routes.spec.ts` — Test file is untracked (not committed) — shows as `?? e2e/t-008-ppr-typed-routes.spec.ts` in git status. The file exists but is not part of the committed codebase.
- **note** `e2e/t-004-eslint-flat-config-migration.spec.ts` — Naming collision: this file is labeled 'T-004' in its describe block, while the PPR task file `e2e/t-008-ppr-typed-routes.spec.ts` is also labeled 'T-004'. Both files share the same task identifier despite being for different tasks.
- **critical** `next.config.mjs` — The primary acceptance criterion is not met: `experimental.ppr: 'incremental'` is NOT present in next.config.mjs. The file contains only `cacheComponents: true` with no `experimental` block whatsoever. Git diff confirms zero changes to this file. The task explicitly requires adding `experimental.ppr: 'incremental'` and the acceptance criterion states 'next.config.mjs has experimental.ppr: incremental enabled'.
- **critical** `e2e/t-008-ppr-typed-routes.spec.ts` — The E2E test asserts `expect(config).toContain('cacheComponents: true')` (line 23) which verifies cacheComponents, NOT PPR config. This test would pass with zero PPR configuration changes, providing zero coverage of the actual requirement. The test comment claims 'experimental.ppr was merged into cacheComponents' — while the @deprecated annotation on ppr in config-shared.d.ts supports this, the task's acceptance criterion explicitly requires the literal `experimental.ppr: 'incremental'` key to be present.
- **warning** `e2e/t-008-ppr-typed-routes.spec.ts` — Test file is untracked (not committed) — shows as `?? e2e/t-008-ppr-typed-routes.spec.ts` in git status. The file exists on disk but is not part of the committed codebase.
- **note** `e2e/t-008-ppr-typed-routes.spec.ts` — Naming collision: this file is labeled 'T-008' in its describe blocks but the task ID is T-004. Meanwhile e2e/t-004-eslint-flat-config-migration.spec.ts also claims T-004. Both files share the same task identifier despite being for different tasks.
