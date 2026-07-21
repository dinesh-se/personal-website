# T-001: Dark Mode Toggle

## Goal

Implement a manual dark mode toggle that switches the site theme and persists the user's choice in localStorage, defaulting to system preference on first visit.

## Acceptance Criteria
> ✅ Verified 2026-07-21

- [x] **AC-1:** Tailwind `darkMode` strategy changed from `media` to `class` in `tailwind.config.ts`
- [x] **AC-2:** Root `<html>` element gets `class="dark"` or `class=""` toggled by Header component
- [x] **AC-3:** Dark mode toggle button rendered in Header with sun/moon icons
- [x] **AC-4:** Preference persisted to localStorage on toggle
- [x] **AC-5:** On first visit, defaults to `prefers-color-scheme: dark` if no localStorage value
- [x] **AC-6:** All existing `dark:` Tailwind variants continue to work without changes
- [x] **AC-7:** Jest snapshot for Header updated to include toggle button
- [x] **AC-8:** All existing Jest tests pass

## Implementation Notes

### Files to Modify

- `tailwind.config.ts` — Add `darkMode: 'class'`
- `src/app/layout.tsx` — Wrap children in `DarkModeProvider`
- `src/app/DarkModeProvider.tsx` — New: wraps app with ThemeProvider, toggles `document.documentElement.classList`
- `src/app/ThemeContext.tsx` — New: React context with `dark` state, `toggleDark()` callback, localStorage read on mount
- `src/components/Header/Header.tsx` — Add toggle button with `SunIcon`/`MoonIcon` from `@heroicons/react/24/outline`
- `src/components/Header/Header.test.tsx` — Wrap in `ThemeProvider`, update snapshot
- `jest.setup.ts` — Add `window.matchMedia` mock for tests

### Architecture (proven in spike)

```
layout.tsx
  └── DarkModeProvider
        ├── ThemeProvider (context: dark, toggleDark)
        └── DarkModeEffects (useEffect: toggle class + localStorage)
              └── <html className={dark ? 'dark' : ''}>
                    <body>
                      Header (uses useTheme().toggleDark)
                      main
                      Footer
```

### State Flow

1. `ThemeProvider` mounts → `useEffect` reads `localStorage.getItem('theme')`
2. If no stored value → `window.matchMedia('(prefers-color-scheme: dark)').matches`
3. `toggleDark()` calls `setDark(d => !d)` → triggers `DarkModeEffects`
4. `DarkModeEffects` `useEffect` → toggles `document.documentElement.classList` + writes to localStorage

### Existing Code Reference

Spike already implemented this architecture. The task is to formalize and verify:

- `src/app/ThemeContext.tsx` — context provider with state management
- `src/app/DarkModeProvider.tsx` — effects wrapper
- `src/components/Header/Header.tsx` — toggle button (already wired)

## User test

Run `npm run dev`, visit any page, click the dark mode toggle in the header, verify theme switches. Reload the page, verify the preference persists. First visit should default to system preference.

## Tests

- **Jest:** Header snapshot updated (`src/components/Header/Header.test.tsx`)
- **Manual:** Visit site, click toggle, verify theme switches. Reload page, verify persistence.

## Dependencies

None — this is the walking skeleton foundation.

## Review findings

Open — the reviewer flagged these:

- **note** `src/app/ThemeContext.tsx` — localStorage is written on initial mount (via useEffect firing after first render), not only on toggle. This persists the system preference to storage even before the user makes an explicit choice. Tested and intentional, but differs from the AC-4 wording 'persisted to localStorage on toggle' — the code persists on mount AND toggle.
- **note** `src/app/DarkModeProvider.tsx` — DarkModeProvider is now a pass-through wrapper (<ThemeProvider>{children}</ThemeProvider>) with no logic of its own. The original spike design had separate DarkModeEffects and HtmlWrapper components; those were consolidated into ThemeContext. Architecturally valid (state + effects co-located) but changes the separation of concerns from the described architecture.
- **note** `src/components/Header/Header.test.tsx` — The beforeEach mock sets matches: query.includes('dark'), meaning any matchMedia query containing the substring 'dark' returns true. This is sufficient for the Header tests but is more aggressive than necessary and could mask issues if matchMedia is called with other queries in the future.

Addressed during review — raised, then fixed before the task committed:

- **critical** `src/app/DarkModeProvider.tsx:14` — AC-4 (localStorage persistence on toggle) is not genuinely tested. The localStorage write in DarkModeEffects (line 14) is never exercised by any test — DarkModeEffects is never rendered in the test suite. The claimed evidence (ThemeContext.test.tsx) only verifies reading from localStorage, not writing to it. Per the rubric, a criterion whose claimed evidence doesn't actually cover it counts as unmet. (raised round 1)
- **warning** `src/app/DarkModeProvider.test.tsx:47` — Tests verify classList toggle and localStorage behavior through manual DOM manipulation rather than rendering the actual DarkModeEffects component. The test at line 47 manually calls document.documentElement.classList.toggle() instead of verifying DarkModeEffects does it. This means the actual side-effect component is not tested — if the effect logic in DarkModeEffects were broken, these tests would still pass. (raised round 1)
- **note** `jest.setup.ts:13` — Exported mockMatchMedia function (line 13) is never imported or used anywhere in the test suite. (raised round 1)
- **note** `src/app/DarkModeProvider.tsx:13` — AC-2 claim states the root <html> class is 'toggled by Header component' but it's actually toggled by DarkModeEffects via document.documentElement.classList.toggle(). The Header only calls toggleDark() which updates context state. The implementation is correct for Next.js App Router (you can't render <html> from a client component), but the claim is misleading. (raised round 1)
- **critical** `src/app/DarkModeProvider.tsx` — AC-2 is not genuinely met: the original architecture had HtmlWrapper rendering <html className={dark ? 'dark' : ''}>, but this was removed in the diff. DarkModeProvider.tsx now only renders <ThemeProvider>{children}</ThemeProvider> without wrapping <html>. The <html> element is rendered by Next.js's default document (no custom _document.tsx exists), so the dark class is never applied to <html> by React. The only dark class application is via document.documentElement.classList.toggle() in a useEffect, which runs after paint — this does not satisfy the criterion that the root <html> element gets the class toggled. (raised round 1)
- **critical** `src/app/ThemeContext.tsx` — The class toggle and localStorage write effect (lines 32-34) is placed inside ThemeProvider, which means it runs as part of the context provider. However, this effect depends on the dark state set by the init effect (lines 22-28). On first render, dark defaults to false, so the class toggle effect runs with dark=false (removing any existing dark class), THEN the init effect sets the correct value, triggering the class toggle effect again. This double-effect pattern means the DOM briefly has no dark class even when dark mode should be active. Combined with the missing HtmlWrapper, there is no way for the <html> element to have the correct class on initial render — FOUC is guaranteed for first-time dark-mode visitors. (raised round 1)
- **critical** `src/app/DarkModeProvider.tsx` — AC-2 claimed evidence (DarkModeProvider.test.tsx) tests document.documentElement.classList.contains('dark'), but the test mocks localStorage and matchMedia, and uses act() to wait for effects. The test verifies the behavior after effects fire, not the actual SSR/hydration behavior. The test passes because effects run synchronously in tests, but in the browser the useEffect fires after paint, causing a flash of wrong theme. The evidence does not exercise the real-world behavior. (raised round 1)
