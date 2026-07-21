# T-004: Header Component ARIA Labels

## Goal

Add descriptive ARIA labels to all interactive elements in the Header component (dark mode toggle, mobile menu toggle, logo link) so screen reader users can understand each control's purpose.

## Covers features

- ARIA labels

## Covers scenarios

- WCAG 2.1 / 4.1.2 Name, Role, Value — all interactive elements have accessible names

## Dependencies

- **Task:** T-001 (dark mode toggle button must exist before adding its aria-label)

## Acceptance criteria

> ✅ Verified 2026-07-21

- [x] **AC-1:** Dark mode toggle button has `aria-label="Toggle dark mode"`
- [x] **AC-2:** Mobile menu toggle button has dynamic `aria-label` — "Open main menu" when closed, "Close main menu" when open
- [x] **AC-3:** Logo link has `aria-label="Home page"` (verify existing, do not remove)
- [x] **AC-4:** Mobile menu container has `role="menu"` or `aria-label="Main navigation"`
- [x] **AC-5:** All nav links in Header have visible text (already satisfied, verify no regression)
- [x] **AC-6:** Playwright E2E test verifies all Header interactive elements have accessible names

## User test

Run `npm run dev`, open the site in a screen reader (or use axe DevTools), navigate to the Header. Verify the dark mode toggle is announced as "Toggle dark mode", the mobile menu toggle announces "Open main menu" (or "Close main menu" when open), and the logo link announces "Home page".

## Tests

- **Playwright E2E:** `e2e/header-aria.spec.ts` — Verify dark mode toggle, mobile menu toggle, and logo link all have accessible names via `getByRole('button', { name: ... })` or `getByRole('link', { name: ... })`
- **axe-core CLI:** `npx axe-core http://localhost:3000 --rules aria-labels` — zero violations on the Header component

## Files likely touched

- `src/components/Header/Header.tsx`
- `e2e/header-aria.spec.ts`

## Do NOT

- Add ARIA labels to components outside the Header (Contact, Footer, NavLinks) — that work is scoped to T-005
- Change the visible text of any link or button
- Modify the Footer or Contact components
