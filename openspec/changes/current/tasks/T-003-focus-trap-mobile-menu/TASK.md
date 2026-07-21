# T-003: Focus Trap in Mobile Menu

## Goal

Implement focus trap within the mobile menu when it's open, and restore focus to the toggle button when the menu closes.

## Acceptance Criteria

- [ ] **AC-1:** When mobile menu is open, Tab key cycles focus only through menu's focusable elements (links, close button)
- [ ] **AC-2:** Shift+Tab cycles focus backwards through menu's focusable elements
- [ ] **AC-3:** Escape key closes the mobile menu
- [ ] **AC-4:** When menu closes (via Escape or close button), focus returns to the hamburger toggle button
- [ ] **AC-5:** Focus trap does not interfere with desktop navigation (menu not open on desktop)
- [ ] **AC-6:** Playwright E2E test verifies focus trap behavior

## Implementation Notes

### Files to Modify

- `src/components/Header/Header.tsx` — Add focus trap logic to the mobile menu

### Implementation Strategy

Use a `useRef` to store the mobile menu element, then add a `useEffect` that listens for `keydown` events when the menu is open:

```tsx
const mobileMenuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!isMobileMenuOpen || !mobileMenuRef.current) return;

  const focusableElements = mobileMenuRef.current.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      toggleMobileMenuState(false);
      firstFocusable?.focus(); // Return focus to toggle button
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isMobileMenuOpen]);
```

### Focus Restore

When the menu closes (via Escape or close button click), focus should return to the hamburger toggle button. The toggle button already has a ref or can be referenced via `useRef`.

### aria-expanded Update

Ensure the toggle button's `aria-expanded` attribute updates dynamically:

```tsx
aria-expanded={isMobileMenuOpen}
```

### Existing Code Reference

- `src/components/Header/Header.tsx` — Already has `useState(false)` for `isMobileMenuOpen`, hamburger button with `aria-controls="mobile-menu"` and `aria-expanded="false"`
- Mobile menu div has `id="mobile-menu"`

## User test

Run `npm run dev`, open the mobile menu on a mobile viewport (or resize browser), press Tab through all menu links, verify focus is trapped within the menu. Press Escape or click the close button, verify the menu closes and focus returns to the toggle button.

## Tests

- **Playwright E2E:** `e2e/focus-trap.spec.ts` — Open mobile menu, verify Tab cycles through menu elements, Escape closes menu and focus returns to toggle

## Dependencies

None — can be implemented in parallel with T-001 and T-002.
