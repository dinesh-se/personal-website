# FIX-004 — fix-heading-contrast-test-for-gradient-text

## Mission

Update the heading contrast test in c3-t-006-color-contrast-audit-fix.spec.ts to correctly handle the gradient-text pattern used on the h1, where text-transparent is on the h1 and the gradient lives on an inner span via bg-clip-text.

## Acceptance criteria

> ⏭️ Skipped 2026-07-21

- [ ] The heading contrast test no longer fails — it passes in both light and dark mode
- [ ] The test checks for the gradient background on the inner span (backgroundImage property) rather than the h1's color property
- [ ] The test still verifies that heading text is visually distinct from the background (not identical colors)
- [ ] The test still checks that text color is not rgba(0, 0, 0, 0) — but accounts for the bg-clip-text pattern where the span itself may also have transparent color but a gradient backgroundImage

## User test

Run: npx playwright test e2e/c3-t-006-color-contrast-audit-fix.spec.ts --grep 'heading text meets large text contrast'. Verify the heading contrast test passes.
