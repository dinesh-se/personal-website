# T-006: Home Page Color Contrast Fixes

## Goal

Audit and fix WCAG 2.1 AA color contrast violations on the Home page (`/`) in both light and dark modes — ensuring body text, headings, and interactive elements meet the required contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components).

## Covers features

- Color palette

## Covers scenarios

- WCAG 2.1 / 1.4.3 Contrast (Minimum) — normal text ≥ 4.5:1, large text ≥ 3:1, UI components ≥ 3:1

## Dependencies

- **None**

## Acceptance criteria

- [ ] **AC-1:** Body text on Home page meets ≥ 4.5:1 contrast ratio in light mode — Tests: `e2e/contrast-home.spec.ts` checks computed `color` and `backgroundColor` on body text in light mode
- [ ] **AC-2:** Body text on Home page meets ≥ 4.5:1 contrast ratio in dark mode — Tests: `e2e/contrast-home.spec.ts` checks computed `color` and `backgroundColor` on body text in dark mode
- [ ] **AC-3:** Heading text on Home page meets ≥ 3:1 contrast ratio (large text threshold) — Tests: `e2e/contrast-home.spec.ts` checks computed colors on heading elements
- [ ] **AC-4:** Interactive elements (links, buttons) meet ≥ 3:1 contrast ratio in both modes — Tests: `e2e/contrast-home.spec.ts` checks computed colors on interactive elements
- [ ] **AC-5:** Focus indicators have ≥ 3:1 contrast against adjacent colors in both modes — Tests: `e2e/contrast-home.spec.ts` checks `outline` or `box-shadow` on `:focus-visible` elements
- [ ] **AC-6:** No brand appearance shift — adjustments stay within current color family (stone/neutral grays) — Tests: manual visual check against original design
- [ ] **AC-7:** axe-core CLI reports zero color-contrast violations on `/` in both light and dark modes — Tests: `npx axe-core http://localhost:3000 --rules color-contrast` exits 0 in both modes

## User test

Run `npm run dev`, visit `/`, switch to dark mode via the toggle. Use the axe DevTools browser extension (or run `npx axe-core http://localhost:3000 --rules color-contrast`) on both light and dark modes. Verify zero contrast violations.

## Tests

- **axe-core CLI:** `npx axe-core http://localhost:3000 --rules color-contrast` — zero violations on `/` in both light and dark modes
- **Playwright E2E:** `e2e/contrast-home.spec.ts` — Verify key text elements on Home page have sufficient contrast by checking computed colors in both modes

## Files likely touched

- `tailwind.config.ts` — Adjust Tailwind color values if needed
- `src/styles/globals.css` — Adjust CSS custom properties if needed
- `src/app/page.tsx` — Verify Home page color classes
- `src/components/Header/Header.tsx` — Verify Header colors on Home page
- `e2e/contrast-home.spec.ts`

## Do NOT

- Fix contrast on pages other than `/` (Home page only) — other pages are out of scope
- Introduce new colors — only adjust lightness/darkness of existing Tailwind colors
- Modify the site's design tokens or color palette beyond what's needed for contrast compliance
