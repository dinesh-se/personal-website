# Product Requirements Document — Dependency Upgrade

## 1. Problem Statement

The personal website runs on Next.js 14.2.21, React 18.3.1, and a set of dependencies that are no longer at their latest stable versions. The CI pipeline uses Node 18 while the local development environment uses Node 24, creating a parity gap. This mismatch risks undetected regressions when code is developed locally and tested in CI. Additionally, running on outdated major versions means the site misses out on performance improvements, security patches, and new features available in Next.js 16 and React 19.

## 2. Goals

- **Upgrade the application to Next.js 16, React 19, and all other direct dependencies to their latest stable versions.**
- **Align CI environment with local development by updating the CI workflow to use Node 24.**
- **Migrate ESLint from v8 (legacy `.eslintrc.json`) to v9 with flat config (`eslint.config.js`).**
- **Verify the upgrade introduces no regressions by passing all existing unit tests (Jest snapshots) and E2E tests (Playwright).**
- **Ensure all 5 pages render correctly in both light and dark modes.**

## 3. Non-Goals

- Adding new features, pages, or components.
- Changing visual design or styling beyond what is required to fix upgrade-induced breakages.
- Modifying external API integrations (Hygraph GraphQL, Dev.to REST).
- Rewriting application logic or data fetching patterns.
- Changing the testing infrastructure itself (the existing Jest + Playwright test suites are used as-is to verify the upgrade).

## 4. User Stories

### 4.1 Developer Experience

**US-1: As a developer, I want the CI pipeline to use the same Node version as my local environment so that I can trust CI results reflect local development.**

- **WHEN** I open a pull request, **THEN** the CI job runs on Node 24 (matching my local dev environment).
- **WHEN** CI passes, **THEN** I can be confident the code works on the same runtime I use locally.

**US-2: As a developer, I want ESLint to use the modern flat config format so that I have access to the latest linting rules and tooling.**

- **WHEN** I run `npm run lint`, **THEN** ESLint v9 executes using `eslint.config.js` (flat config) with zero errors.
- **WHEN** I run `npm run format`, **THEN** Prettier continues to check and format code without errors.

### 4.2 Application Correctness

**US-3: As a visitor, I want all pages to load correctly on the upgraded stack so that my experience is unchanged.**

- **WHEN** I visit the home page (`/`), **THEN** it renders with my greeting, summary, recent projects, and experience timeline.
- **WHEN** I visit the about page (`/about`), **THEN** it renders my bio, display picture, and tech stack logos.
- **WHEN** I visit the projects page (`/projects`), **THEN** it renders a grid of my GitHub projects.
- **WHEN** I visit the blog page (`/blog`), **THEN** it renders my Dev.to published articles.
- **WHEN** I visit the uses page (`/uses`), **THEN** it renders my developer tools and tech stack list.

**US-4: As a visitor, I want the site to support dark mode so that I can read comfortably in low-light conditions.**

- **WHEN** my system prefers dark mode, **THEN** all pages render with dark mode styles (CSS custom properties + Tailwind `dark:` variants).
- **WHEN** I toggle the system theme, **THEN** the site responds correctly to the color scheme change.

**US-5: As a visitor, I want the navigation to work correctly so that I can move between pages.**

- **WHEN** I click a navigation link in the Header or Footer, **THEN** I am taken to the correct page.
- **WHEN** I am on a page, **THEN** the corresponding navigation link is highlighted as active.
- **WHEN** I am on a mobile device, **THEN** I can open and close the hamburger menu to access navigation links.

### 4.3 Build and Deployment

**US-6: As a developer, I want the build to succeed so that the site can be deployed.**

- **WHEN** I run `npm run build`, **THEN** the build completes with zero TypeScript errors and zero ESLint errors.
- **WHEN** the build succeeds, **THEN** all 5 pages are statically generated with ISR revalidation (600s).

## 5. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Upgrade `next` from `^14.2.21` to `^16.x` (latest stable) | Must |
| FR-2 | Upgrade `react` and `react-dom` from `^18.3.1` to `^19.x` (latest stable) | Must |
| FR-3 | Upgrade `@vercel/analytics` from `^1.3.1` to `^2.x` (latest stable) | Must |
| FR-4 | Upgrade `@types/react` and `@types/react-dom` from `^18` to `^19` | Must |
| FR-5 | Upgrade all other direct dependencies to their latest stable versions | Should |
| FR-6 | Upgrade `eslint-config-next` to match Next.js 16 | Must |
| FR-7 | Migrate ESLint from v8 (`.eslintrc.json`) to v9 with flat config (`eslint.config.js`) | Must |
| FR-8 | Update CI workflow to use Node 24 and `setup-node@v4` | Must |
| FR-9 | Fix all resulting TypeScript errors | Must |
| FR-10 | Fix all resulting ESLint errors | Must |
| FR-11 | All Jest snapshot tests pass (8 components) | Must |
| FR-12 | All Playwright E2E tests pass | Must |
| FR-13 | All 5 pages render without runtime errors | Must |
| FR-14 | Mobile menu toggles correctly | Should |
| FR-15 | Navigation active state highlights correctly | Should |
| FR-16 | Dark mode renders correctly on all pages | Should |

## 6. Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | No functional regressions — all existing tests must pass | Must |
| NFR-2 | No changes to external API integrations (Hygraph, Dev.to) | Must |
| NFR-3 | No visual design changes beyond what is required to fix upgrade breakages | Should |
| NFR-4 | Build time should not increase significantly (>10% degradation is unacceptable) | Should |
| NFR-5 | Page load performance should not degrade (measured via Lighthouse or similar) | Should |
| NFR-6 | The upgrade should be completable in a single PR without intermediate breaking changes | Should |

## 7. Dependencies

| Dependency | Current Version | Target Version | Notes |
|------------|----------------|----------------|-------|
| `next` | `^14.2.21` | `^16.x` | Major upgrade; App Router changes, Turbopack defaults |
| `react` / `react-dom` | `^18.3.1` | `^19.x` | Major upgrade; PropTypes removal, new hooks, context API changes |
| `@vercel/analytics` | `^1.3.1` | `^2.x` | Minor upgrade; should be drop-in compatible |
| `@types/react` / `@types/react-dom` | `^18` | `^19` | Must match React 19 |
| `eslint` | `^8` | `^9` | Major upgrade; flat config required |
| `eslint-config-next` | `^14.2.12` | `^16.x` | Must match Next.js 16 |
| `@typescript-eslint/*` | `^8.6.0` | Latest compatible with ESLint 9 | Version bump required |
| `jest` | `^29.7.0` | Latest stable | Verify React 19 compatibility |
| `@testing-library/react` | `^16.0.1` | Latest stable | Verify React 19 compatibility |
| `ts-jest` | `^29.2.5` | Latest stable | Verify TypeScript/React compatibility |
| `@graphcms/rich-text-react-renderer` | `^0.6.2` | Latest stable | Verify React 19 compatibility |
| `react-social-icons` | `^6.18.0` | Latest stable | Verify React 19 compatibility |
| `@svgr/webpack` | `^8.1.0` | Latest stable | Verify Next.js 16 webpack compatibility |
| `tailwindcss` | `^3.4.12` | Latest stable (v3.x) | Stay on v3 unless v4 is stable and compatible |
| `prettier` | `^3.3.3` | Latest stable | Minor upgrade |
| `@heroicons/react` | `^2.1.5` | Latest stable | Minor upgrade |
| `clsx` | `^2.1.1` | Latest stable | Minor upgrade |
| `graphql-request` | `^7.1.0` | Latest stable | Verify Next.js 16 server component compatibility |

## 8. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| React 19 breaking changes in Server Components | High | High | Fix TypeScript errors first, then run tests, fix runtime issues one-by-one |
| `@graphcms/rich-text-react-renderer` incompatible with React 19 | Medium | High | Check for v1.x release; if none, pin to React 18 compat or fork |
| `react-social-icons` uses deprecated React APIs | Medium | Medium | Check for updated version; if none, pin or replace with `@heroicons/react` |
| ESLint 9 flat config migration breaks existing rules | Medium | Medium | Start with `@eslint/js` flat config template, migrate rules one-by-one |
| Next.js 15/16 webpack config changes break SVG loading | Low | Medium | Verify `@svgr/webpack` config in `next.config.mjs` still works after upgrade |
| `ts-jest` incompatible with new TypeScript/React versions | Low | Medium | Ensure `ts-jest` version supports the TypeScript version in use |
| Node 24 in CI breaks on GitHub Actions runners | Low | Low | `setup-node@v4` supports Node 24 on `ubuntu-latest` |

## 9. Success Metrics

- **Zero TypeScript errors** after `npm run build`
- **Zero ESLint errors** after `npm run lint`
- **100% Jest test pass rate** (8 component snapshots)
- **100% Playwright E2E test pass rate**
- **All 5 pages render** without runtime errors in dev mode
- **CI passes** on Node 24 with updated workflow

## 10. Out of Scope (Explicit)

- Migration from `package-lock.json` to another package manager (pnpm, yarn)
- Migration from npm to another package manager
- Adding new dependencies beyond version upgrades
- Removing deprecated dependencies (unless they become incompatible)
- Upgrading indirect/transitive dependencies beyond what is required by direct dependency upgrades
- Performance optimization beyond what is naturally gained from the upgrade

---

## 1. Product Vision

The personal website is a developer portfolio and personal brand presence hosted on Vercel. It currently runs on Next.js 14.2.21, React 18.3.1, and a CI pipeline on Node 18 — all behind the current stable releases. This gap creates a development-deployment parity mismatch (local dev uses Node 24, CI uses Node 18) and leaves the site without performance improvements, security patches, and new features available in Next.js 16 and React 19.

This upgrade ensures the site runs on modern, supported versions while preserving every existing page, integration, and visual behavior. No features are added or removed; the goal is a clean, regression-free migration to the latest stable stack.

_Source: `openspec/changes/current/proposal.md` (Feature Brief, Problem Statement context); `openspec/specs/prd.md` §1–2._

## 2. Scope

### In Scope (v1)

| Area | Action | Source |
|------|--------|--------|
| `next` | Upgrade from `^14.2.21` to `^16.x` | proposal.md Feature Scope |
| `react` / `react-dom` | Upgrade from `^18.3.1` to `^19.x` | proposal.md Feature Scope |
| `@vercel/analytics` | Upgrade from `^1.3.1` to `^2.x` | proposal.md Feature Scope |
| `@types/react` / `@types/react-dom` | Upgrade from `^18` to `^19` | proposal.md Feature Scope |
| All other direct dependencies | Bump to latest stable versions | proposal.md Feature Scope |
| `eslint-config-next` | Match Next.js 16 (requires ESLint 9) | proposal.md Feature Scope |
| ESLint | Migrate from v8 (`.eslintrc.json`) to v9 flat config (`eslint.config.js`) | proposal.md Feature Scope |
| CI workflow | Update Node 18 → 24, `setup-node` v2 → v4 | proposal.md Feature Scope |
| TypeScript / lint / test errors | Fix all resulting breakages | proposal.md Feature Scope |
| Page rendering | Verify all 5 pages load without runtime errors | proposal.md Acceptance Criteria #6 |

### Out of Scope

- Adding new features, pages, or components.
- Changing visual design or styling beyond what is required to fix upgrade-induced breakages.
- Modifying external API integrations (Hygraph GraphQL, Dev.to REST).
- Rewriting application logic or data fetching patterns.
- Changing the testing infrastructure itself (Jest + Playwright suites used as-is).
- Migration to a different package manager (pnpm, yarn).
- Removing deprecated dependencies unless they become incompatible.
- Upgrading indirect/transitive dependencies beyond what direct upgrades require.

_Source: `openspec/changes/current/proposal.md` (Feature Scope, Out of scope); `openspec/specs/prd.md` §3, §10._

## 3. Feature List (Prioritized)

| # | Feature | Priority | Source |
|---|---------|----------|--------|
| 1 | Upgrade `next` to `^16.x` | P0 | proposal.md; prd.md FR-1 |
| 2 | Upgrade `react` / `react-dom` to `^19.x` | P0 | proposal.md; prd.md FR-2 |
| 3 | Upgrade `@vercel/analytics` to `^2.x` | P0 | proposal.md; prd.md FR-3 |
| 4 | Upgrade `@types/react` / `@types/react-dom` to `^19` | P0 | proposal.md; prd.md FR-4 |
| 5 | Migrate ESLint v8 → v9 (flat config) | P0 | proposal.md; prd.md FR-6, FR-7 |
| 6 | Update CI workflow to Node 24 (`setup-node@v4`) | P0 | proposal.md; prd.md FR-8 |
| 7 | Fix all resulting TypeScript errors | P0 | proposal.md; prd.md FR-9 |
| 8 | Fix all resulting ESLint errors | P0 | proposal.md; prd.md FR-10 |
| 9 | All Jest snapshot tests pass (8 components) | P0 | proposal.md; prd.md FR-11 |
| 10 | All Playwright E2E tests pass | P0 | proposal.md; prd.md FR-12 |
| 11 | All 5 pages render without runtime errors | P0 | proposal.md; prd.md FR-13 |
| 12 | Upgrade all other direct dependencies to latest stable | P1 | proposal.md; prd.md FR-5 |
| 13 | Mobile menu toggles correctly | P1 | proposal.md; prd.md FR-14 |
| 14 | Navigation active state highlights correctly | P1 | proposal.md; prd.md FR-15 |
| 15 | Dark mode renders correctly on all pages | P1 | proposal.md; prd.md FR-16 |

_Source: `openspec/changes/current/proposal.md` (Feature Scope, Acceptance Criteria); `openspec/specs/prd.md` §5._

## 4. Requirements & Scenarios

### Requirement: The dependency installation completes without peer dependency conflicts.

#### Scenario: Clean install after package.json bump
- GIVEN all dependency versions in `package.json` are updated to their target versions
- WHEN `npm install` is executed
- THEN the install process completes with exit code 0 and zero peer dependency conflict warnings

_Source: proposal.md Acceptance Criteria #1; prd.md FR-1._

### Requirement: The production build completes with zero TypeScript and zero ESLint errors.

#### Scenario: Build succeeds after dependency upgrade
- GIVEN all dependencies are installed at their upgraded versions
- WHEN `npm run build` is executed
- THEN the build exits with code 0
- AND the build output contains zero TypeScript compilation errors
- AND the build output contains zero ESLint errors

_Source: proposal.md Acceptance Criteria #2; prd.md FR-9, FR-10._

### Requirement: All Jest snapshot tests pass after the upgrade.

#### Scenario: Jest snapshot suite passes
- GIVEN all dependencies are installed at their upgraded versions
- WHEN `npm test` is executed
- THEN all 8 component snapshot tests pass with zero failures

_Source: proposal.md Acceptance Criteria #3; prd.md FR-11._

### Requirement: All Playwright E2E tests pass after the upgrade.

#### Scenario: Playwright E2E suite passes
- GIVEN the upgraded app is running in dev mode
- WHEN `npx playwright test` is executed
- THEN all E2E tests pass with zero failures

_Source: proposal.md Acceptance Criteria #4; prd.md FR-12._

### Requirement: The CI workflow runs on Node 24 and passes lint and test steps.

#### Scenario: CI job executes on Node 24
- GIVEN the CI workflow file (`.github/workflows/lint-test.yml`) is updated to use Node 24 and `setup-node@v4`
- WHEN a pull request is opened
- THEN the CI job runs on Node 24
- AND the lint step passes
- AND the test step passes

_Source: proposal.md Acceptance Criteria #5; prd.md FR-8._

### Requirement: All five pages render without runtime errors.

#### Scenario: Pages render without runtime errors
- GIVEN the upgraded app is built and running
- WHEN the following routes are visited — `/`, `/about`, `/projects`, `/blog`, `/uses`
- THEN each page loads without JavaScript runtime errors
- AND each page renders its expected content (greeting, bio, project grid, articles, tech stack list)

_Source: proposal.md Acceptance Criteria #6; prd.md FR-13._

### Requirement: Dark mode styles apply correctly on all pages.

#### Scenario: Dark mode renders on all pages
- GIVEN dark mode is active (via system preference or toggle)
- WHEN any page is visited
- THEN dark mode styles apply via CSS custom properties and Tailwind `dark:` variants
- AND no visual elements are broken or invisible

_Source: proposal.md Acceptance Criteria #7; prd.md FR-16._

### Requirement: ESLint executes using the flat config format with zero errors.

#### Scenario: Lint runs on flat config
- GIVEN ESLint has been migrated from `.eslintrc.json` to `eslint.config.js` (flat config)
- WHEN `npm run lint` is executed
- THEN ESLint v9 runs using `eslint.config.js`
- AND the command exits with zero errors

_Source: proposal.md Acceptance Criteria #8; prd.md FR-6, FR-7._

### Requirement: The mobile navigation menu opens and closes correctly.

#### Scenario: Hamburger menu toggle works
- GIVEN the app is viewed on a mobile viewport width
- WHEN the hamburger menu button is clicked
- THEN the mobile navigation menu opens
- AND clicking the button again closes the menu

_Source: proposal.md Acceptance Criteria #9; prd.md FR-14._

### Requirement: The active navigation link is highlighted in both Header and Footer.

#### Scenario: Active link highlighting
- GIVEN the user is on a specific page (any of `/`, `/about`, `/projects`, `/blog`, `/uses`)
- WHEN the Header or Footer component renders
- THEN the navigation link corresponding to the current route is visually highlighted as active

_Source: proposal.md Acceptance Criteria #10; prd.md FR-15._

## 5. Non-Functional Requirements

_Source: `openspec/specs/prd.md` §6 (preserved verbatim)._ | ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | No functional regressions — all existing tests must pass | Must |
| NFR-2 | No changes to external API integrations (Hygraph, Dev.to) | Must |
| NFR-3 | No visual design changes beyond what is required to fix upgrade breakages | Should |
| NFR-4 | Build time should not increase significantly (>10% degradation is unacceptable) | Should |
| NFR-5 | Page load performance should not degrade (measured via Lighthouse or similar) | Should |
| NFR-6 | The upgrade should be completable in a single PR without intermediate breaking changes | Should |

## 6. Assumptions

| # | Assumption | Source | Rationale |
|---|------------|--------|-----------|
| A1 | Next.js 16.x and React 19.x are stable and available on the target deployment platform (Vercel) | proposal.md (Feature Brief) | Major version upgrades require platform support; Vercel supports Node 24 and Next.js 16. |
| A2 | `@graphcms/rich-text-react-renderer` has a version compatible with React 19, or a compatible fork/workaround exists | proposal.md Integration Concerns | Incompatibility would break the /about page; mitigation is pinning or forking. |
| A3 | `react-social-icons` has a version compatible with React 19, or can be replaced with `@heroicons/react` | proposal.md Integration Concerns | Incompatibility would break the Contact component. |
| A4 | `@svgr/webpack` is compatible with Next.js 16's webpack configuration | proposal.md Integration Concerns | SVG loading is used across multiple pages. |
| A5 | `ts-jest` has a version compatible with the TypeScript version in use and React 19 | proposal.md Risks | Required for Jest unit test execution. |
| A6 | `setup-node@v4` supports Node 24 on `ubuntu-latest` GitHub Actions runners | proposal.md Risks | Required for CI parity with local dev. |
| A7 | The existing Jest + Playwright test suites are sufficient to validate the upgrade with zero regressions | proposal.md Next Steps, test-harness question | No new test infrastructure is added; existing suites are the acceptance criterion. |
| A8 | Tailwind CSS v3.x remains the target; v4 is not included unless confirmed stable and compatible | proposal.md Feature Scope (`tailwindcss`) | Major Tailwind upgrade could introduce breaking style changes. |
| A9 | No changes to Hygraph GraphQL schema or Dev.to API contract are needed during the upgrade | proposal.md Integration Concerns | External API integrations are out of scope. |
| A10 | The site is deployed on Vercel, which provides automatic Node.js version support and Next.js 16 compatibility | proposal.md context (Vercel Analytics usage, `@vercel/*` packages) | Deployment platform determines supported Node/Next.js versions. |

_Source: `openspec/changes/current/proposal.md` (Integration Concerns, Risks, Open Questions); `openspec/specs/prd.md` §3, §10._
