# Task T-002: Experience formatDate Bug Fix

## Goal

Fix the `formatDate()` function in `Experience.tsx` that incorrectly parses DD/MM/YYYY date strings (e.g., `"31/01/2024"`) from Hygraph, which JavaScript's `new Date()` cannot parse, producing `"Invalid Date"` in the output.

## Background

The `Experience` component receives date strings from Hygraph in DD/MM/YYYY format (e.g., `"31/01/2024"`). The current implementation calls `new Date(date)` directly, which fails on this format because JavaScript's `Date` constructor only reliably parses ISO 8601 strings (YYYY-MM-DD) or US-format strings (MM/DD/YYYY).

The fix must:

1. Parse DD/MM/YYYY strings correctly
2. Display the output in MMM YYYY format (e.g., "Jan 2024") — **no visual change to the output format**
3. Handle the `"Present"` case (when `to` is null/undefined) — no change needed here

### Current Code (broken)

```typescript
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
  });
```

### Fixed Code (example)

```typescript
const formatDate = (date: string) => {
  const [day, month, year] = date.split('/').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
  });
};
```

## Scope

### Files to Modify

1. `src/components/Experience/Experience.tsx` — Fix `formatDate()` function

### Files to NOT Modify

- All other component files
- All page files
- Test files (the snapshot will auto-update if CSS changes, but the format output is unchanged)

## Acceptance Criteria

- [ ] `formatDate()` correctly parses DD/MM/YYYY date strings (e.g., `"31/01/2024"` → `"Jan 2024"`)
- [ ] `formatDate()` produces correct output for all date formats present in Hygraph data
- [ ] No `"Invalid Date"` strings appear anywhere in the rendered output
- [ ] The displayed date format remains MMM YYYY (e.g., "Jan 2024", "May 2023") — **no visual change to the output format**
- [ ] `npm test` — all 8 Jest snapshot tests pass (the Experience snapshot may need updating if CSS changed, but the date format output must be correct)
- [ ] `npm run build` completes with zero TypeScript errors and zero ESLint errors
- [ ] `npm run lint` — zero ESLint errors
- [ ] `npm run typecheck` — zero TypeScript errors
- [ ] `npx playwright test` — all 9 E2E tests pass
- [ ] All 5 pages render correctly in both light and dark modes
- [ ] Dark mode styles apply correctly on all pages via system preference toggle
- [ ] The mobile navigation menu opens and closes correctly on a mobile viewport width
- [ ] The active navigation link is highlighted in both Header and Footer when on any page
- [ ] All five pages render without runtime errors when visiting each route in a browser
- [ ] The production build succeeds with zero TypeScript and zero ESLint errors
- [ ] The CI workflow runs on Node 24 and passes lint and test steps
- [ ] No visual changes to existing UI components — only the date parsing logic is fixed

## Implementation Notes

### Date Parsing

- Hygraph stores dates in DD/MM/YYYY format (e.g., `"31/01/2024"`)
- Split on `/`, map to numbers, construct Date with `new Date(year, month - 1, day)` (month is 0-indexed)
- Use `toLocaleDateString('en', { year: 'numeric', month: 'short' })` for output — **same as current**

### Edge Cases

- The `"Present"` case in the JSX (when `to` is null/undefined) is handled separately and does not call `formatDate` — no change needed
- If Hygraph ever returns a different date format, the fix should be robust enough to handle it (but current format is DD/MM/YYYY)

### Key Constraints

- **No visual change** — the output format (MMM YYYY) must remain identical to what it was supposed to produce
- No new dependencies
- Must follow existing project conventions (TypeScript strict mode, path aliases)

## User test

Run `npm test` to verify the Experience snapshot still passes. Run `npm run build` and `npm run lint` — zero errors. Visit the home page (`/`) and about page (`/about`) in a browser, verify all organization dates display as MMM YYYY (e.g., 'Jan 2024') with no 'Invalid Date' strings. Run `npx playwright test` — all 9 E2E tests pass. Toggle system dark mode and verify dark mode styles apply correctly on all pages. On a mobile viewport width, verify the hamburger menu opens and closes. Verify the active navigation link is highlighted in both Header and Footer.

## Traceability

- **PRD**: FR-13 (all 5 pages render without runtime errors), FR-16 (dark mode), FR-14 (mobile menu), FR-15 (nav active state)
- **Proposal**: "Experience formatDate bug fix", "no visual change to the output format"
- **Architecture**: §1 Module Boundaries (Experience component), §2 Folder Structure
- **UX Spec**: §1 Screen Inventory (Experience section on home page), §4 Screen Specs (responsive behavior)
