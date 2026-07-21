# T-001: Dark Mode Toggle

## Goal

Implement a manual dark mode toggle that switches the site theme and persists the user's choice in localStorage, defaulting to system preference on first visit.

## Acceptance Criteria

- [ ] **AC-1:** Tailwind `darkMode` strategy changed from `media` to `class` in `tailwind.config.ts`
- [ ] **AC-2:** Root `<html>` element gets `class="dark"` or `class=""` toggled by Header component
- [ ] **AC-3:** Dark mode toggle button rendered in Header with sun/moon icons
- [ ] **AC-4:** Preference persisted to localStorage on toggle
- [ ] **AC-5:** On first visit, defaults to `prefers-color-scheme: dark` if no localStorage value
- [ ] **AC-6:** All existing `dark:` Tailwind variants continue to work without changes
- [ ] **AC-7:** Jest snapshot for Header updated to include toggle button
- [ ] **AC-8:** All existing Jest tests pass

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
