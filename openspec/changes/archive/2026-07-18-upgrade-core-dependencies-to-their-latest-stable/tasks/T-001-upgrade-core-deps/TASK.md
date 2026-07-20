# T-001 — Upgrade Core Dependencies (Next.js 16, React 19, Types, Analytics)

**Milestone:** 1 — Core Dependency Upgrade (Walking Skeleton)

## Mission

Upgrade the four core dependencies (`next`, `react`/`react-dom`, `@types/react`/`@types/react-dom`, `@vercel/analytics`) to their latest stable versions, fix all resulting TypeScript errors, and verify the build succeeds with all 5 pages rendering correctly. This is the walking skeleton — the smallest end-to-end increment that proves the entire upgrade path works from package.json through TypeScript compilation to page rendering.

## Covers features

- Upgrade `next` to `^16.x`
- Upgrade `react` / `react-dom` to `^19.x`
- Upgrade `@types/react` / `@types/react-dom` to `^19`
- Upgrade `@vercel/analytics` to `^2.x`

## Covers scenarios

- None (this is a dependency upgrade task; behavioral verification is covered in later tasks)

## Dependencies

- **None**

## Acceptance criteria

> ✅ Verified 2026-07-17

- [x] `package.json` has `next: "^16.x"`, `react: "^19.x"`, `react-dom: "^19.x"`, `@types/react: "^19"`, `@types/react-dom: "^19"`, `@vercel/analytics: "^2.x"`
- [x] `npm install` completes with exit code 0 and zero peer dependency conflict warnings
- [x] `npm run build` succeeds with zero TypeScript errors
- [x] `src/app/layout.tsx` still imports `<Analytics />` without type errors (API may have changed)
- [x] `next.config.mjs` has no warnings about deprecated options
- [x] All 5 pages (`/`, `/about`, `/projects`, `/blog`, `/uses`) render without JavaScript runtime errors
- [x] Tests: `npm test` passes (existing Jest snapshots may need updates in T-007, but no new TS errors should appear)
- [x] `npm run typecheck` (or `npm run build`) and `npm run lint` pass

## User test

1. Run `npm install` — verify no peer dependency conflicts
2. Run `npm run build` — verify zero TypeScript errors in output
3. Run `npm test` — verify existing tests still run (snapshot mismatches are acceptable here; they are fixed in T-007)
4. Run `npm run dev` — then visit `/`, `/about`, `/projects`, `/blog`, `/uses` — verify each page loads without errors and renders expected content

## Files likely touched

- `package.json`
- `src/app/layout.tsx`
- `next.config.mjs` (if deprecated options trigger warnings)

## Do NOT

- Upgrade any dependencies beyond the four core packages listed above
- Modify any component logic or page rendering
- Change the ESLint configuration (handled in T-004)

## Review findings

Open — the reviewer flagged these:

- **note** `package.json` — The --webpack flag in build/dev scripts is redundant in Next.js 16 where webpack is the default bundler, but it is not deprecated and does not cause issues.
- **note** `next.config.mjs` — reactStrictMode is set to true. This option is still supported in Next.js 16 but has been a no-op for several versions. Not a breaking change, but worth noting.
- **note** `.pi/kalam/dashboard.html` — This file is part of the kalam pipeline dashboard (status tracking), not the Next.js application. Its changes in the diff are unrelated to the dependency upgrade task but were included in the working tree.
