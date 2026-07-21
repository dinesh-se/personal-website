# FIX-006 — fix-letter-spacing-normal-parsing-and-gap-locator

## Mission

Fix two bugs in the blog typography/spacing e2e test: (1) handle the CSS 'normal' keyword for letterSpacing so it doesn't produce NaN, and (2) target the blog post grid instead of a generic gap-matching selector that picks up the footer.

## Acceptance criteria
> ✅ Verified 2026-07-21

- [x] letterSpacing test handles 'normal' keyword by converting it to '0px' (or 0) before parseFloat, so default-styles paragraphs pass
- [x] gap/spacing test targets the blog post grid via data-testid='blog-post-grid' instead of the generic [class*='gap-'] selector
- [x] The regex for gap values should match both 'gap-6' and 'gap-y-6' variants (e.g., /gap(?:-[xy])?-(4|6|8|10|12)/)
- [x] Both tests pass when running npx playwright test c3-t-007-typography-spacing-refinements
- [x] The test still correctly rejects negative letter-spacing values (e.g., '-0.05em') if they were present

## User test

Run: npx playwright test e2e/c3-t-007-typography-spacing-refinements.spec.ts --reporter=line. Verify both the 'blog post letter-spacing is appropriate for readability' and 'spacing between blog post cards is consistent' tests pass (status: expected).
