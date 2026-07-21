# FIX-005 — fix-heading-contrast-test-gradient-text

## Mission

Fix the heading contrast e2e test so it reads the visible text color from gradient-text headings instead of the transparent wrapper element.

## Acceptance criteria

> ⏭️ Skipped 2026-07-21

- [ ] The 'heading text meets large text contrast ratio' test passes in both light and dark mode
- [ ] The test reads color from the first text-bearing descendant of the heading when the heading itself has transparent color
- [ ] No other tests in c3-t-006-color-contrast-audit-fix.spec.ts are affected

## User test

Run npx playwright test e2e/c3-t-006-color-contrast-audit-fix.spec.ts --project=chromium and verify all 5 specs pass (body text light, body text dark, heading contrast, interactive elements, focus indicators)
