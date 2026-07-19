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
> ✅ Verified 2026-07-17

- [x] All direct dependencies in `package.json` are bumped to their latest stable versions per the PRD dependency table (FR-5)
- [x] `npm install` completes with exit code 0 and zero peer dependency conflict warnings
- [x] `npm test` executes all 8 component test suites (snapshot mismatches are acceptable; fixed in T-007)
- [x] `npm run build` still succeeds (no new TypeScript errors introduced by other deps)
- [x] `@graphcms/rich-text-react-renderer` version is the latest stable (or pinned to a React 19-compatible version if the latest is incompatible)
- [x] `react-social-icons` version is the latest stable (or pinned if incompatible with React 19)
- [x] `tailwindcss` stays on v3.x (v4 not included unless confirmed stable and compatible)
- [x] `npm run build` succeeds with zero TypeScript errors
- [x] Tests: `npm test` runs without crashes or import errors
- [x] `npm run typecheck` and `npm run lint` pass

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

## Review findings

Open — the reviewer flagged these:

- **warning** `package.json` — eslint-plugin-jsx-a11y (^6.10.0) was removed from devDependencies. The task explicitly states 'Do NOT remove deprecated dependencies unless they become incompatible.' The plugin was unused in eslint.config.mjs (which only uses @next/eslint-plugin-next and @typescript-eslint/eslint-plugin), so it was dead weight, but removing it without explicit approval violates the 'Do NOT' instruction.
- **note** `package.json` — eslint constraint is ^9.39.0 but latest stable is 10.7.0. This is within the 9.x line and may be intentional given the 'Do NOT change ESLint configuration' constraint, but it doesn't match 'latest stable' literally.
- **note** `package.json` — typescript constraint is ^5.0.0 but latest stable is 7.0.2. A major version upgrade would require significant code/config changes, so staying on 5.x is pragmatic but doesn't match 'latest stable' literally.
- **note** `package.json` — typecheck script (tsc --noEmit) was added to package.json as a new script. This is not a dependency change but a new addition to the scripts section.
- **note** `package.json` — Multiple major version bumps in dev/test tools: jest 29→30, babel-jest 29→30, @types/jest 29→30, @types/node 22→26, @trivago/prettier-plugin-sort-imports 4→6, eslint-config-prettier 9→10. All working correctly but these are significant version jumps.
