# FIX-003 — fix-color-contrast-test-gradient-text

## Mission

Update the heading contrast test in c3-t-006-color-contrast-audit-fix.spec.ts to skip or handle elements that use the `text-transparent` + `bg-clip-text` gradient pattern, since their computed color is transparent by design and cannot be validated with a simple solid-color comparison.

## Acceptance criteria

> ⏭️ Skipped 2026-07-21

- [ ] The 'heading text meets large text contrast ratio (≥ 3:1)' test passes in both light and dark mode
- [ ] The test skips h1/h2/h3 elements that have `text-transparent` class (or `bg-clip-text` on a child)
- [ ] Non-gradient headings (like the h2 summary) are still validated for contrast
- [ ] No changes to the visual appearance of the gradient text on the h1

## User test

1. Run `npx playwright test c3-t-006-color-contrast-audit-fix.spec.ts --grep 'heading text meets large text contrast ratio'`
2. Verify the test passes in both light and dark mode
3. Visually confirm the gradient h1 on the home page still renders correctly
