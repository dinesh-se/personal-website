# T-008 — Fix Playwright E2E Tests

**Milestone:** 3 — Test Verification

## Mission

Fix all Playwright E2E test failures introduced by the dependency upgrades and verify all E2E tests pass. This includes fixing locators that may have changed due to React 19 rendering differences, updating mock fixtures if API response formats changed, and ensuring the test infrastructure (mocking, dev server, configuration) works correctly with the upgraded stack. This is a vertical slice: fix all E2E test failures and verify the full E2E test suite passes.

## Covers features

- All Playwright E2E tests pass

## Covers scenarios

- None (this is a test maintenance task; behavioral verification is covered in later tasks)

## Dependencies

- **Task:** T-003 (TypeScript errors must be fixed first to ensure the app renders correctly for E2E tests)

## Acceptance criteria

> ✅ Verified 2026-07-17

- [x] All Playwright E2E tests pass with zero failures
- [x] Navigation tests (blog, about, uses, projects) pass
- [x] Mobile menu toggle test passes
- [x] Dark mode test passes
- [x] Footer links test passes
- [x] Nav active-state test passes
- [x] Mock fixtures (`e2e/fixtures/hygraph-author.json`, `e2e/fixtures/devto-posts.json`) match expected API response formats
- [x] `e2e/setup.cjs` correctly mocks Hygraph GraphQL and Dev.to REST endpoints
- [x] Navigation tests (blog, about, uses, projects) pass
- [x] Mobile menu toggle test passes
- [x] Dark mode test passes
- [x] Footer links test passes
- [x] Nav active-state test passes
- [x] `npx playwright test` exits with code 0
- [x] Tests: `npx playwright test` — all tests pass
- [x] `npm run typecheck` and `npm run lint` pass

## User test

1. Run `npx playwright test` — verify all E2E tests pass
2. Manually verify the following in the browser:
   - Navigate to `/` — verify greeting, page title, footer render
   - Click navigation links — verify navigation works
   - Toggle dark mode — verify dark mode styles apply
   - Open mobile menu — verify hamburger menu toggles
   - Click footer links — verify external links open correctly

## Files likely touched

- `e2e/home.spec.ts`
- `e2e/setup.cjs`
- `e2e/fixtures/hygraph-author.json`
- `e2e/fixtures/devto-posts.json`
- `e2e/playwright.config.ts`
- `e2e/shared/intercept-api.ts` (if shared helpers exist)

## Do NOT

- Add new E2E tests (new tests are outside scope)
- Change the application code
- Modify external API integrations (Hygraph, Dev.to)

## Review findings

Open — the reviewer flagged these:

- **warning** `e2e/home.spec.ts:74` — The dark mode test only checks for 'antialiased' on the body element, which is always present regardless of dark mode state. It does not actually test dark mode behavior (e.g., toggling dark mode class or verifying dark CSS variables apply). The test passes but doesn't verify what it claims to test.

Addressed during review — raised, then fixed before the task committed:

- **critical** `e2e/playwright.config.ts` — Running `npx playwright test` from the project root fails because Playwright picks up Jest `.test.tsx` files in `src/components/` during discovery, causing ReferenceErrors (describe/jest not defined). All 11 E2E tests pass when run from the `e2e/` directory, but the user test specifies `npx playwright test` (implied from root). The config has `testDir: '.'` which resolves to root, and while `testMatch: '**/*.spec.ts'` should filter out `.test.tsx` files, Playwright still attempts to load them during discovery. Fix: change `testDir` from `'.'` to `'e2e/'` or add `'**/*.test.tsx'` to `testIgnore`. No change to `playwright.config.ts` was included in this task's diff. (raised round 1)
- **critical** `e2e/home.spec.ts` — Acceptance criteria lists 'Nav active-state test passes' but no such test exists in `home.spec.ts`. The test file has 11 tests covering: page title, greeting, header nav, footer, navigation to about/projects/blog/uses, mobile menu toggle, dark mode system preference, and footer links. There is no test verifying that navigation links show an active state based on the current route. (raised round 1)
- **warning** `e2e/fixtures/hygraph-author.json` — The fixture change from `{ 'uses': { 'nodes': [...] } }` to `{ 'uses': [...] }` is correct — the GraphQL query `GET_USES` returns `uses` as a direct field and the TypeScript type `uses: Uses[]` confirms it's an array. However, the old fixture structure matches the pattern used by `githubRecentProjects.repositories.nodes`, suggesting the developer may have copy-pasted the wrong shape. The fix is correct but the root cause (why the fixture was wrong) is unclear. (raised round 1)
- **note** `e2e/setup.cjs` — The mock wraps the Hygraph fixture in `{ data: hygraphFixture }` (correct for GraphQL responses) and returns the Dev.to fixture directly (correct for REST API returning an array). The mock is correct and complete. (raised round 1)
- **note** `e2e/home.spec.ts` — The `waitForLoadState('networkidle')` addition to the mobile menu test is a reasonable fix for timing issues, but it may introduce flakiness if the page loads slowly. Consider using `waitForSelector` for the menu button instead, which is more targeted. (raised round 1)
