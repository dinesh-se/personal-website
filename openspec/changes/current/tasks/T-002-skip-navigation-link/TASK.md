# T-002: Skip Navigation Link

## Goal

Add a skip navigation link to all pages that becomes visible on first Tab press and jumps to the main content area.

## Acceptance Criteria

- [ ] **AC-1:** Skip navigation link rendered at the top of every page (before Header or inside Header at the top)
- [ ] **AC-2:** Link is visually hidden by default (opacity-0 or visually-hidden utility)
- [ ] **AC-3:** Link becomes visible on `:focus` with sufficient contrast
- [ ] **AC-4:** Link text is "Skip to main content"
- [ ] **AC-5:** Clicking the link scrolls to the `<main>` element
- [ ] **AC-6:** Skip link does not visually disrupt layout for mouse users
- [ ] **AC-7:** Playwright E2E test verifies skip link visibility on Tab press

## Implementation Notes

### Files to Modify

- `src/styles/globals.css` — Add skip nav link styles:

  ```css
  .skip-nav {
    @apply sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded-md;
  }
  ```

- `src/app/layout.tsx` — Add skip nav link before `<Header>`:

  ```tsx
  <a href="#main-content" className="skip-nav">
    Skip to main content
  </a>
  ```

- All 5 page files — Ensure `<main>` has `id="main-content"`:

  ```tsx
  <main id="main-content" className="...">
  ```

### CSS Pattern

Use Tailwind's `sr-only` utility for hiding, then override with `focus:not-sr-only` for visible focus state. This is the standard pattern for skip navigation links.

### Existing Code Reference

- `src/styles/globals.css` — Already has Tailwind directives and CSS custom properties
- `src/app/layout.tsx` — Already has `<main>` element (add `id="main-content"`)

## User test

Run `npm run dev`, visit any page, press Tab on page load, verify a skip navigation link becomes visible and clicking it jumps to the main content area.

## Tests

- **Playwright E2E:** `e2e/skip-navigation.spec.ts` — Verify skip link is hidden by default, visible on Tab, and clicking it scrolls to main content

## Dependencies

None — can be implemented in parallel with T-001 and T-003.
