# Feature Brief

**Feature:** Upgrade core dependencies to their latest stable versions: Next.js 14 to 16, React 18 to 19, @vercel/analytics 1 to 2, and any other outdated packages. Bump the CI workflow's Node version to match the local dev environment (currently pinned to Node 18 in CI, but local dev uses Node 24). Goal is a clean, working upgrade with no regressions, so the e2e/unit test harness from the previous cycle can be used with confidence on a modern stack.

## Feature Scope

**In scope:**

- Upgrade `next` from `^14.2.21` to `^16.x` (latest stable)
- Upgrade `react` from `^18.3.1` to `^19.x` (latest stable)
- Upgrade `react-dom` from `^18.3.1` to `^19.x` (latest stable)
- Upgrade `@vercel/analytics` from `^1.3.1` to `^2.x` (latest stable)
- Upgrade `@types/react` and `@types/react-dom` from `^18` to `^19` (must match React 19)
- Upgrade `typescript-eslint` packages (`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`) to versions compatible with ESLint 9
- Upgrade **all other direct dependencies** to their latest stable versions:
  - `@heroicons/react`, `clsx`, `graphql-request`, `tailwindcss`, `prettier`, `eslint`, `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@svgr/webpack`, `@graphcms/rich-text-react-renderer`, `@graphcms/rich-text-types`, `react-social-icons`, `autoprefixer`, `postcss`, `ts-jest`, `babel-jest`, `jest-environment-jsdom`, `ts-node`, `@types/node`, `@types/jest`, `eslint-config-next`, `eslint-config-prettier`, `eslint-plugin-jsx-a11y`, `eslint-plugin-prettier`, `@trivago/prettier-plugin-sort-imports`, `prettier-plugin-tailwindcss`, `release-it`
- Upgrade `eslint-config-next` to match Next.js 16 (requires ESLint 9)
- Migrate ESLint from v8 (`.eslintrc.json`) to v9 with flat config (`eslint.config.js`)
- Update CI workflow (`.github/workflows/lint-test.yml`) to use Node 24 and `setup-node@v4` (v2 does not support Node 24)
- Fix all resulting TypeScript errors, lint errors, and test failures
- Run full E2E + unit test suite to verify no regressions

**Out of scope:**

- Rewriting application logic or components
- Adding new features or pages
- Visual design changes
- Changing external API integrations (Hygraph, Dev.to)
- Changing the testing infrastructure itself (Playwright E2E tests and Jest unit tests are used as-is to verify the upgrade)

## Acceptance Criteria

1. **Given** all dependencies are upgraded in `package.json`, **when** `npm install` runs, **then** the install completes without peer dependency conflicts or errors.
2. **Given** all dependencies are installed, **when** `npm run build` runs, **then** the build completes successfully with zero TypeScript errors and zero ESLint errors.
3. **Given** all dependencies are installed, **when** `npm test` runs, **then** all existing Jest snapshot tests pass (8 component snapshots).
4. **Given** the E2E test infrastructure is wired up, **when** `npx playwright test` runs, **then** all E2E tests pass against the upgraded app.
5. **Given** the CI workflow is updated, **when** a PR is opened, **then** the CI job runs on Node 24 and passes lint + test steps.
6. **Given** the upgraded app is built, **when** all 5 pages (/, /about, /projects, /blog, /uses) are rendered, **then** they load without runtime errors and render expected content.
7. **Given** dark mode is active, **when** any page is visited, **then** dark mode styles apply correctly (CSS custom properties + Tailwind `dark:` variants).
8. **Given** the ESLint migration is complete, **when** `npm run lint` runs, **then** it executes using the new flat config format with zero errors.
9. **Given** mobile navigation is used, **when** the hamburger menu is toggled, **then** the mobile menu opens and closes correctly (verified by E2E).
10. **Given** a route is active, **when** the Header or Footer renders, **then** the active link is highlighted correctly (verified by E2E).

## Affected Areas

| Area | Files | Impact |
|------|-------|--------|
| **Package manager** | `package.json`, `package-lock.json` | All dependency versions bumped |
| **CI/CD** | `.github/workflows/lint-test.yml` | Node version 18→24, `setup-node` action v2→v4 |
| **ESLint** | `.eslintrc.json` → `eslint.config.js` | Full migration from legacy to flat config |
| **Next.js config** | `next.config.mjs` | May need updates for Next.js 15/16 API changes (e.g., `reactStrictMode` deprecation, new image/headers APIs) |
| **TypeScript** | `tsconfig.json`, `next-env.d.ts` | May need updates for React 19 types, Next.js 16 compiler changes |
| **Jest** | `jest.config.ts`, `jest.setup.ts`, `babel.config.json` (if present) | May need updates for React 19 testing, `ts-jest` compatibility |
| **React types** | `@types/react`, `@types/react-dom` | Must match React 19; affects all `.tsx` files |
| **Source code** | `src/app/**/*.tsx`, `src/components/**/*.tsx`, `src/api/**/*.ts`, `src/types/**/*.ts` | May need fixes for React 19 breaking changes (PropTypes removal, new hooks, context API changes, server component patterns) |
| **CSS** | `src/styles/globals.css`, `tailwind.config.ts` | Unlikely to need changes unless Tailwind CSS v4 is included in "latest stable" |
| **Metadata** | `src/app/robots.ts`, `src/app/sitemap.ts` | Unlikely to need changes |

## Data Needs

None — uses existing integrations (Hygraph GraphQL, Dev.to REST). No new data sources or migration scripts required.

## Integration Concerns

- **Hygraph GraphQL:** `graphql-request` may need version bump; verify compatibility with Next.js 16 server components. The GraphQL client uses `fetch` under the hood — verify no breaking changes in the library.
- **Dev.to REST:** Uses native `fetch` (no library dependency) — no integration concerns.
- **@graphcms/rich-text-react-renderer:** Verify v0.6.x+ is compatible with React 19. If not, check for a v1.x release or consider a fork/workaround.
- **react-social-icons:** Verify compatibility with React 19. If using deprecated APIs, update or pin version.
- **@svgr/webpack:** Verify compatibility with Next.js 16's webpack configuration. May need version bump.
- **Vercel Analytics:** `@vercel/analytics@2.x` should be a drop-in replacement for `@vercel/analytics@1.x` in `<Analytics />` component in `src/app/layout.tsx`.

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| React 19 breaking changes in Server Components | High — could break all pages | Fix TypeScript errors first, then run tests, then fix runtime issues one-by-one |
| ESLint 9 flat config migration breaks existing rules | Medium — blocks CI | Start with `@eslint/js` flat config template, migrate rules one-by-one |
| `@graphcms/rich-text-react-renderer` incompatible with React 19 | High — breaks /about page | Check for v1.x release; if none, pin to React 18 compat or fork |
| `react-social-icons` uses deprecated React APIs | Medium — breaks Contact component | Check for updated version; if none, pin or replace with `@heroicons/react` |
| Next.js 15/16 webpack config changes break SVG loading | Medium — breaks all SVG icons | Verify `@svgr/webpack` config in `next.config.mjs` still works after upgrade |
| `ts-jest` incompatible with new TypeScript/React versions | Medium — blocks unit tests | Ensure `ts-jest` version supports the TypeScript version in use |
| Node 24 in CI breaks on older GitHub Actions runners | Low — unlikely | `setup-node@v4` supports Node 24 on `ubuntu-latest` |
| ESLint 8.57+ flat config as middle ground | Low — could simplify migration | If full ESLint 9 migration proves difficult, fall back to ESLint 8 with flat config |

## Open Questions

- **test-harness:** User deferred — implementation should run the full E2E + unit test suite to verify upgrade safety. If any test fails, the specific failure must be fixed before considering the upgrade complete.

## Next Steps

1. Install all upgraded dependencies and run `npm run build` — capture all TypeScript/ESLint errors
2. Migrate ESLint from `.eslintrc.json` to `eslint.config.js` (flat config)
3. Fix all TypeScript errors one-by-one
4. Run `npm test` — fix any Jest/snapshot failures
5. Wire up E2E tests (if not already wired) and run `npx playwright test`
6. Update CI workflow (Node 24, `setup-node@v4`)
7. Verify all 5 pages render correctly in dev mode
8. Commit and open PR
