# T-009: axe-core CI Integration and Playwright A11y E2E Tests

## Goal

Integrate axe-core CLI into the CI pipeline for automated WCAG audits and add Playwright E2E tests for keyboard navigation and focus states.

## Acceptance Criteria

- [ ] **AC-1:** `axe-core` added as a dev dependency in `package.json` — Tests: `package.json` contains `"axe-core": "^4.x.x"` in `devDependencies`
- [ ] **AC-2:** `axe-core` CLI command added to `package.json` scripts (e.g., `npm run a11y:audit`) — Tests: `npm run a11y:audit` runs axe-core CLI
- [ ] **AC-3:** ESLint `jsx-a11y` plugin level set to `strict` in `eslint.config.js` — Tests: `npm run lint` exits 0 with zero jsx-a11y errors
- [ ] **AC-4:** GitHub Actions workflow (`lint-test.yml`) runs axe-core audit on PR to `main` — Tests: `.github/workflows/lint-test.yml` contains axe-core step
- [ ] **AC-5:** Playwright E2E test file `e2e/a11y-keyboard.spec.ts` verifies keyboard navigation — Tests: `npx playwright test e2e/a11y-keyboard.spec.ts` passes
- [ ] **AC-6:** Playwright E2E test file `e2e/a11y-focus.spec.ts` verifies focus states — Tests: `npx playwright test e2e/a11y-focus.spec.ts` passes
- [ ] **AC-7:** CI job fails if any WCAG AA violations are detected — Tests: axe-core `--exit` flag causes non-zero exit on violations

## Implementation Notes

### Files to Create/Modify

- `package.json` — Add `axe-core` as dev dependency, add `a11y:audit` script
- `.github/workflows/lint-test.yml` — Add axe-core CLI step
- `e2e/a11y-keyboard.spec.ts` — New Playwright E2E test for keyboard navigation
- `e2e/a11y-focus.spec.ts` — New Playwright E2E test for focus states

### axe-core CLI Integration

Add to `package.json`:

```json
{
  "devDependencies": {
    "axe-core": "^4.x.x"
  },
  "scripts": {
    "a11y:audit": "npx axe-core http://localhost:3000 --exit"
  }
}
```

Add to `.github/workflows/lint-test.yml`:

```yaml
- name: Run axe-core accessibility audit
  run: |
    npm run dev &
    sleep 10
    npm run a11y:audit
```

### Playwright E2E Tests

**`e2e/a11y-keyboard.spec.ts`:**

```ts
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('skip navigation link is visible on Tab', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeVisible();
  });

  test('all pages are keyboard accessible', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/blog', '/uses'];
    for (const path of pages) {
      await page.goto(path);
      // Tab through all interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      // Verify no focus is lost
      await expect(page.locator(':focus')).toBeVisible();
    }
  });
});
```

**`e2e/a11y-focus.spec.ts`:**

```ts
import { test, expect } from '@playwright/test';

test.describe('Focus Management', () => {
  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveCSS('outline', /solid|dashed|dotted/);
  });

  test('mobile menu traps focus', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /open main menu/i });
    await menuButton.click();
    // Tab through menu elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Focus should still be within menu
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('focus returns to toggle on menu close', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    const menuButton = page.getByRole('button', { name: /open main menu/i });
    await menuButton.click();
    await page.keyboard.press('Escape');
    // Focus should return to menu button
    await expect(menuButton).toBeFocused();
  });
});
```

### CI Pipeline Structure

Current CI pipeline (`lint-test.yml`):

1. Checkout code
2. Setup Node.js
3. `npm ci`
4. `npm run lint`
5. `npm test`

New CI pipeline:

1. Checkout code
2. Setup Node.js
3. `npm ci`
4. `npm run lint`
5. `npm test`
6. **NEW:** `npm run dev` (background)
7. **NEW:** `npm run a11y:audit`

### Existing Code Reference

- `.github/workflows/lint-test.yml` — Current CI workflow (lint + test)
- `e2e/` — Existing Playwright E2E test files (9 files)
- `package.json` — Current dependencies and scripts
- `playwright.config.ts` — Playwright configuration

## User test

Run `npm test` and verify all Jest snapshot tests and Playwright E2E tests pass, including the new a11y test files for keyboard navigation and focus states.

## Tests

- **CI:** GitHub Actions workflow runs axe-core audit on PR to `main`
- **Playwright:** `npx playwright test e2e/a11y-*.spec.ts` — all tests pass
- **Jest:** `npm test` — all tests pass (existing + any updates)

## Dependencies

- **None** (ESLint jsx-a11y strict configuration is included in this task's AC-3/AC-4)
