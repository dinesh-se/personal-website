# T-007: Blog Page Typography and Spacing

## Goal

Fix line-height, letter-spacing, and spacing inconsistencies on the Blog page (`/blog`) to improve readability — ensuring body text has line-height ≥ 1.5 and section spacing uses consistent Tailwind utilities.

## Covers features

- Typography
- Spacing

## Covers scenarios

- WCAG 2.1 / 1.4.12 Text Spacing — line-height and spacing support readability

## Dependencies

- **None**

## Acceptance criteria

> ✅ Verified 2026-07-21

- [x] **AC-1:** Blog post body text has line-height ≥ 1.5 (`leading-relaxed` or `leading-[1.625]`) — Tests: `e2e/blog-typography.spec.ts` checks computed `lineHeight` on blog post body text
- [x] **AC-2:** Blog post letter-spacing is appropriate for readability (no tighter than Tailwind default) — Tests: `e2e/blog-typography.spec.ts` checks computed `letterSpacing` on blog post body text
- [x] **AC-3:** Spacing between blog post cards uses consistent Tailwind spacing values (e.g., `gap-6` or `gap-8`) — Tests: `e2e/blog-typography.spec.ts` checks computed `margin`/`padding` on post cards
- [x] **AC-4:** Blog page section spacing uses Tailwind utilities (`py-8`, `py-12`, or `py-16`) — no ad-hoc pixel values — Tests: `e2e/blog-typography.spec.ts` verifies no ad-hoc pixel values in spacing classes
- [x] **AC-5:** No new CSS custom properties or Tailwind config entries added — Tests: manual check of `globals.css` and `tailwind.config.ts`
- [x] **AC-6:** Blog page layout is not visually disrupted after changes — Tests: `e2e/blog-typography.spec.ts` verifies `document.body.scrollHeight` is stable
- [x] **AC-7:** All blog post cards render without layout shifts — Tests: `e2e/blog-typography.spec.ts` verifies all post cards are visible and positioned correctly

## User test

Run `npm run dev`, visit `/blog`. Inspect blog post body text — verify line-height is at least 1.5. Check spacing between post cards is consistent. Verify no ad-hoc pixel values in spacing classes.

## Tests

- **Playwright E2E:** `e2e/blog-typography.spec.ts` — Verify blog post cards have consistent spacing by checking computed margin/padding values, and verify no layout shifts via `page.evaluate(() => document.body.scrollHeight)`
- **Manual:** Visual inspection of `/blog` in both light and dark modes

## Files likely touched

- `src/app/blog/page.tsx`
- `src/components/BlogPostCard/BlogPostCard.tsx`
- `src/styles/globals.css` — Add global `body { @apply leading-relaxed; }` if not already present
- `e2e/blog-typography.spec.ts`

## Do NOT

- Modify typography on pages other than `/blog` (Home, About, Projects, Uses)
- Add new Tailwind config entries or CSS custom properties
- Change the blog post card component's visual design beyond spacing/typography

## Review findings

Open — the reviewer flagged these:

- **note** `src/components/BlogPostCard/BlogPostCard.tsx` — Added data-testid attributes (blog-post-card, blog-post-body) to production DOM — common testing pattern but technically pollutes the DOM with test-only attributes. Not a blocking issue.
- **note** `src/app/blog/BlogContent.tsx` — Added data-testid='blog-post-grid' to production DOM — same note as above.
