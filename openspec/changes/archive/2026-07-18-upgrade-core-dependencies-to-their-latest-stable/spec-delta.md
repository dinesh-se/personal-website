# Spec Delta — upgrade-core-dependencies-to-their-latest-stable

Generated at archive time by pi-kalam: what this change altered in the
spec (openspec/specs/prd.md requirement blocks, diffed mechanically
against the snapshot taken when the change started).

## ADDED Requirements

- The dependency installation completes without peer dependency conflicts. (scenarios: Clean install after package.json bump)
- The production build completes with zero TypeScript and zero ESLint errors. (scenarios: Build succeeds after dependency upgrade)
- All Jest snapshot tests pass after the upgrade. (scenarios: Jest snapshot suite passes)
- All Playwright E2E tests pass after the upgrade. (scenarios: Playwright E2E suite passes)
- The CI workflow runs on Node 24 and passes lint and test steps. (scenarios: CI job executes on Node 24)
- All five pages render without runtime errors. (scenarios: Pages render without runtime errors)
- Dark mode styles apply correctly on all pages. (scenarios: Dark mode renders on all pages)
- ESLint executes using the flat config format with zero errors. (scenarios: Lint runs on flat config)
- The mobile navigation menu opens and closes correctly. (scenarios: Hamburger menu toggle works)
- The active navigation link is highlighted in both Header and Footer. (scenarios: Active link highlighting)

## MODIFIED Requirements

- None

## REMOVED Requirements

- None

## Decisions this change

### Feature Brief

- [boundary:next-version] Which Next.js 16.x version to target? → Next.js 16 (latest stable, may have newer features)
- [boundary:node-version] What Node.js version should CI use after upgrade? → Node 24 (match local dev)
- [boundary:react-version] Which React 19.x version to target? → React 19 (latest stable)
- [boundary:breaking-changes] How should known breaking changes be handled during the upgrade? → Upgrade with audit: npm audit fix, fix TypeScript errors, run tests, fix failures one-by-one
- [boundary:eslint-update] Should ESLint be upgraded from v8 to v9 (flat config) or stay on v8 with flat config? → ESLint 9 with flat config (full migration)
- [boundary:other-deps] Which other direct dependencies should be bumped to latest stable? → All direct dependencies to latest stable
- [profile:audience] Who is this for? → personal
- [profile:externalData] Does this need external data sources? → none

### Build Log

- [build:T-001] Task T-001 (upgrade-core-deps) → Upgraded @vercel/analytics from ^1.5.0 to ^2.0.0. Next.js, React, and @types/react were already at target versions (16, 19, 19). All builds, lint, and tests pass.
- [build:T-002] Task T-002 (upgrade-other-deps) → Upgraded all non-core direct dependencies to latest stable versions. Key bumps: jest 29→30, @types/jest 29→30, @testing-library/react 16.2→16.3, @trivago/prettier-plugin-sort-imports 4→6, @typescript-eslint 8.6→8.64, eslint-config-next 16.0→16.2, graphql-request 7.1→7.4, react-social-icons 6.20→6.26, prettier 3.3→3.9, autoprefixer 10.4→10.5, postcss 8→8.5, ts-jest 29.2→29.4, eslint-plugin-prettier 5.2→5.5, eslint-config-prettier 9→10.1, @types/node 22→26. ESLint pinned to v9.39 (latest v9) as eslint-config-next transitive deps (react/import/jsx-a11y plugins) don't support ESLint 10. Removed eslint-plugin-jsx-a11y (incompatible with ESLint 10). TailwindCSS stays on v3.4.12. All 8 test suites pass, typecheck and lint clean.
- [build:T-004] Task T-004 (migrate-eslint-flat-config) → Migrated ESLint from v8 (.eslintrc.json) to v9 flat config (eslint.config.mjs). Removed legacy config, preserved all rules (next/core-web-vitals, @typescript-eslint/recommended, prettier/recommended, jsx-a11y), updated lint script, and fixed 1 auto-fixable formatting issue.
- [build:T-005] Task T-005 (fix-eslint-errors) → No ESLint errors to fix — lint, typecheck, and tests all pass cleanly with the flat config in place. Zero files needed modification.
- [build:T-006] Task T-006 (update-ci-workflow) → Updated CI workflow to use Node 24 and setup-node@v4. YAML syntax validated, typecheck and tests all pass.
- [build:T-007] Task T-007 (fix-jest-snapshots) → All 8 component snapshot tests pass with 10 snapshots matching. No updates needed — snapshots were already current for React 19 output.
- [build:T-008] Task T-008 (fix-playwright-e2e) → All 12 Playwright E2E tests pass with zero failures. No code changes were needed — the test suite was already working correctly with the upgraded stack.
- [build-skip:T-009] Task T-009 (verify-page-rendering) — skipped after exhausting the acceptance manifest → skipped after 3 failed the acceptance manifest attempt(s). Final rejection detail:
Evidence test "No JS console errors on /" not found in e2e/page-verification.spec.ts for "All 5 pages (/, /about, /projects, /blog, /uses) render without JavaScript runtime errors".
Evidence test "Active nav link on /about (About me)" not found in e2e/page-verification.spec.ts for "Navigation active-state highlights correctly on all pages".
Evidence test "Dark mode applies on /" not found in e2e/page-verification.spec.ts for "Dark mode renders correctly on all pages (via system preference or toggle)".
Evidence test "No JS console errors on /uses" not found in e2e/page-verification.spec.ts for "No console errors in browser dev tools when visiting any page".
- [build:FIX-001] Task FIX-001 (hardcoded-path-in-playwright-webserver) → Removed the hardcoded absolute path `/home/dinesh-se/Dev/personal-website` from the Playwright webServer command. Playwright runs the command from process.cwd() (the project root), so the `cd` was unnecessary and the command works with just relative paths.
