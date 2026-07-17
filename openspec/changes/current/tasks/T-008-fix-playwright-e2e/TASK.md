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

- [ ] All Playwright E2E tests pass with zero failures
- [ ] Navigation tests (blog, about, uses, projects) pass
- [ ] Mobile menu toggle test passes
- [ ] Dark mode test passes
- [ ] Footer links test passes
- [ ] Nav active-state test passes
- [ ] Mock fixtures (`e2e/fixtures/hygraph-author.json`, `e2e/fixtures/devto-posts.json`) match expected API response formats
- [ ] `e2e/setup.cjs` correctly mocks Hygraph GraphQL and Dev.to REST endpoints
- [ ] Navigation tests (blog, about, uses, projects) pass
- [ ] Mobile menu toggle test passes
- [ ] Dark mode test passes
- [ ] Footer links test passes
- [ ] Nav active-state test passes
- [ ] `npx playwright test` exits with code 0
- [ ] Tests: `npx playwright test` — all tests pass
- [ ] `npm run typecheck` and `npm run lint` pass

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
