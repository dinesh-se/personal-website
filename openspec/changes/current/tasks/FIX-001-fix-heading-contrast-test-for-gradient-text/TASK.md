# FIX-001 — fix-heading-contrast-test-for-gradient-text

## Mission

Update the heading contrast test in c3-t-006-color-contrast-audit-fix.spec.ts so it checks the actual visible text color of the h1 (the inner span with bg-clip-text gradient) instead of the h1 wrapper itself, which uses text-transparent for the gradient text effect.

## Acceptance criteria
> ⏭️ Skipped 2026-07-21

- [ ] The heading contrast test no longer fails on the h1 element with text-transparent
- [ ] The test checks the inner span's color when the first heading is an h1 with a gradient-text span child
- [ ] The test still validates that h2 and h3 headings (which don't use text-transparent) have non-transparent colors
- [ ] The test uses page.evaluate to query the first visible text element within the first heading, not the heading element itself

## User test

Run: npx playwright test e2e/c3-t-006-color-contrast-audit-fix.spec.ts --grep 'heading text meets large text'. All tests should pass.
