# T-002 — Upgrade All Other Direct Dependencies

**Milestone:** 1 — Core Dependency Upgrade

## Mission

Bump all remaining direct dependencies in `package.json` to their latest stable versions, fix all resulting TypeScript errors, and verify the build succeeds. This is a vertical slice: upgrade deps, fix compilation errors, and verify the app still builds. Includes testing tools (Jest, ts-jest, @testing-library/react), linting/formatter tools (Prettier, eslint-config-next, @typescript-eslint/*), UI libraries (@heroicons/react, react-social-icons, clsx), build tools (tailwindcss, postcss, autoprefixer, @svgr/webpack), and data fetching libraries (graphql-request).

## Covers features

- Upgrade all other direct dependencies to latest stable

## Covers scenarios

- None (this is a dependency upgrade task; behavioral verification is covered in later tasks)

## Dependencies

- **Task:** T-001 (core dependencies must be upgraded first to establish a consistent baseline)

## Acceptance criteria

- [ ] All direct dependencies in `package.json` are bumped to their latest stable versions per the PRD dependency table (FR-5)
- [ ] `npm install` completes with exit code 0 and zero peer dependency conflict warnings
- [ ] `npm test` executes all 8 component test suites (snapshot mismatches are acceptable; fixed in T-007)
- [ ] `npm run build` still succeeds (no new TypeScript errors introduced by other deps)
- [ ] `@graphcms/rich-text-react-renderer` version is the latest stable (or pinned to a React 19-compatible version if the latest is incompatible)
- [ ] `react-social-icons` version is the latest stable (or pinned if incompatible with React 19)
- [ ] `tailwindcss` stays on v3.x (v4 not included unless confirmed stable and compatible)
- [ ] `npm run build` succeeds with zero TypeScript errors
- [ ] Tests: `npm test` runs without crashes or import errors
- [ ] `npm run typecheck` and `npm run lint` pass

## User test

1. Run `npm install` — verify no peer dependency conflicts
2. Run `npm run build` — verify zero TypeScript errors
3. Run `npm test` — verify all 8 test suites execute (snapshot mismatches are expected; fixed in T-007)

## Files likely touched

- `package.json`
- `src/api/graphql.ts` (if graphql-request API changed)
- `src/components/Contact/Contact.tsx` (if react-social-icons API changed)
- `src/app/about/page.tsx` (if @graphcms/rich-text-react-renderer API changed)
- `next.config.mjs` (if @svgr/webpack or tailwindcss config changed)

## Do NOT

- Upgrade any indirect/transitive dependencies beyond what direct upgrades require
- Add new dependencies
- Remove deprecated dependencies unless they become incompatible
- Change the ESLint configuration (handled in T-004)
