# FIX-002 — fix-heading-contrast-test-gradient-text

## Mission

Fix the heading contrast test (c3-t-006-color-contrast-audit-fix.spec.ts) so it correctly handles headings that use the bg-clip-text / text-transparent gradient technique instead of flagging them as having 1:1 contrast ratio.

## Acceptance criteria

> ⏭️ Skipped 2026-07-21

- [ ] The 'heading text meets large text contrast ratio (≥ 3:1)' test passes when run against the home page
- [ ] The test correctly identifies gradient-text headings by checking for bg-clip-text spans inside heading elements
- [ ] For gradient-text headings, the test verifies the span's background gradient is visible (not transparent)
- [ ] For non-gradient headings, the existing check (heading color !== background color) still applies
- [ ] The test does not break for other pages that may have different heading patterns

## User test

Run: npx playwright test e2e/c3-t-006-color-contrast-audit-fix.spec.ts --grep 'heading text meets large text contrast'. The 'heading text meets large text contrast ratio (≥ 3:1)' test should pass. Also verify the other 4 tests in the same file still pass.
