# Product Requirements Document — Visual Theming & Accessibility

## 1. Problem Statement

The personal website uses Tailwind CSS with a `prefers-color-scheme`-only dark mode and has no user-controlled theme toggle. Color contrast has not been audited against WCAG 2.1 AA standards, and the site lacks several accessibility fundamentals: no skip navigation link, no focus management in the mobile menu, no ARIA labels on interactive elements, and inconsistent use of semantic HTML across pages. These gaps exclude keyboard-only users, screen reader users, and users who need higher contrast — despite the site being a public-facing portfolio that should model developer best practices.

## 2. Goals

- **Implement a manual dark mode toggle (defaulting to system preference) stored in localStorage**, replacing the current `prefers-color-scheme`-only approach.
- **Achieve WCAG 2.1 AA compliance** across all 5 pages: color contrast ≥ 4.5:1 for text, ≥ 3:1 for large text and UI components, visible focus indicators, and semantic HTML structure.
- **Add keyboard navigation support**: skip navigation link, focus trap in the mobile menu, and focus restore on close.
- **Add ARIA labels** to all interactive elements where visual labels are insufficient.
- **Tighten ESLint `jsx-a11y` rules** from `recommended` to `strict` and fix all resulting violations.
- **Add accessibility testing** to the test harness: axe-core CLI audit and new Playwright E2E tests for keyboard navigation and focus states.
- **Refine typography and spacing** within the existing Tailwind utilities — fix line-height, letter-spacing, and inconsistent spacing without introducing new design tokens.

## 3. Non-Goals

- Adding new pages, features, or components.
- Introducing new font families, Google Fonts, or a custom typography scale.
- Building a new custom spacing scale or design system.
- Colorblind mode or specialized accessibility features beyond WCAG 2.1 AA.
- Modifying external API integrations (Hygraph GraphQL, Dev.to REST).
- Performance optimizations beyond a11y requirements.
- Screen reader content beyond ARIA labels.

## 4. User Stories

### 4.1 Theme & Visual Consistency

**US-1: As a visitor, I want to manually toggle between light and dark modes so that I can choose the theme that suits my preference, regardless of my system setting.**

- **WHEN** I visit the site, **THEN** the theme matches my system preference.
- **WHEN** I click the dark mode toggle in the header, **THEN** the site switches to the opposite theme and remembers my choice across page reloads.

**US-2: As a visitor, I want consistent color contrast and readable typography so that I can read content comfortably in both light and dark modes.**

- **WHEN** I view any page, **THEN** all text meets WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
- **WHEN** I read body text, **THEN** line-height is at least 1.5 and letter-spacing is appropriate for readability.

### 4.2 Keyboard & Screen Reader Accessibility

**US-3: As a keyboard-only user, I want to navigate the entire site without a mouse so that I can access all content and controls.**

- **WHEN** I press Tab on page load, **THEN** a skip navigation link is visible and jumps to the main content.
- **WHEN** I tab through all interactive elements, **THEN** every element has a visible focus indicator with sufficient contrast.
- **WHEN** I open the mobile menu and tab through it, **THEN** focus is trapped within the menu.
- **WHEN** I close the mobile menu (via Escape or button), **THEN** focus returns to the toggle button.

**US-4: As a screen reader user, I want semantic HTML and ARIA labels so that I can understand the page structure and purpose of controls.**

- **WHEN** I navigate any page, **THEN** headings follow a sequential hierarchy (single `<h1>`, no skipped levels).
- **WHEN** I interact with buttons or links, **THEN** they have descriptive labels (visible text or `aria-label`/`aria-labelledby`).
- **WHEN** I visit the about page, **THEN** rich text content renders with semantic elements (headings, lists, paragraphs) — not generic `<div>` wrappers.

### 4.3 Developer Experience

**US-5: As a developer, I want automated accessibility checks in CI so that regressions are caught before deployment.**

- **WHEN** a pull request is opened, **THEN** CI runs axe-core CLI to audit all pages for WCAG violations.
- **WHEN** `npm run lint` is executed, **THEN** ESLint enforces `jsx-a11y` at `strict` level with zero errors.

**US-6: As a developer, I want Playwright E2E tests for keyboard navigation so that focus management and tab order are validated automatically.**

- **WHEN** `npx playwright test` is executed, **THEN** new a11y tests for keyboard navigation, focus states, and skip navigation pass.

## 5. Functional Requirements

| ID    | Requirement                                                                                     | Priority |
| ----- | ----------------------------------------------------------------------------------------------- | -------- |
| FR-1  | Change Tailwind dark mode strategy from `media` to `class`                                      | Must     |
| FR-2  | Add dark mode toggle button in Header with localStorage persistence                             | Must     |
| FR-3  | Detect and default to system `prefers-color-scheme` on first visit                              | Must     |
| FR-4  | Audit and fix all color contrast violations to meet WCAG 2.1 AA (4.5:1 text, 3:1 UI/large text) | Must     |
| FR-5  | Add skip navigation link to all pages                                                           | Must     |
| FR-6  | Implement focus trap in mobile menu (Header component)                                          | Must     |
| FR-7  | Implement focus restore on mobile menu close                                                    | Must     |
| FR-8  | Ensure visible focus indicators on all interactive elements (≥ 3:1 contrast)                    | Must     |
| FR-9  | Add ARIA labels to all interactive elements lacking descriptive text                            | Must     |
| FR-10 | Ensure single `<h1>` per page and sequential heading hierarchy                                  | Must     |
| FR-11 | Ensure landmark regions (`<main>`, `<nav>`, `<header>`, `<footer>`) on all pages                | Must     |
| FR-12 | Verify rich text renderer on `/about` produces semantic HTML                                    | Must     |
| FR-13 | Tighten ESLint `jsx-a11y` from `recommended` to `strict` and fix all violations                 | Must     |
| FR-14 | Fix line-height (≥ 1.5 body) and letter-spacing for readability                                 | Should   |
| FR-15 | Fix inconsistent spacing between components and sections                                        | Should   |
| FR-16 | Integrate axe-core CLI into CI pipeline                                                         | Should   |
| FR-17 | Add Playwright E2E tests for keyboard navigation and focus states                               | Should   |
| FR-18 | All 5 pages render without runtime errors after changes                                         | Must     |
| FR-19 | All existing Jest snapshot tests pass (updated for new toggle button)                           | Must     |
| FR-20 | All existing Playwright E2E tests pass                                                          | Must     |

## 6. Non-Functional Requirements

| ID    | Requirement                                                  | Priority |
| ----- | ------------------------------------------------------------ | -------- |
| NFR-1 | WCAG 2.1 AA compliance across all 5 pages                    | Must     |
| NFR-2 | No functional regressions — all existing tests must pass     | Must     |
| NFR-3 | No changes to external API integrations (Hygraph, Dev.to)    | Must     |
| NFR-4 | No new font families or custom spacing scales introduced     | Should   |
| NFR-5 | Dark mode toggle adds minimal JS overhead (< 1KB gzipped)    | Should   |
| NFR-6 | Changes are scoped to existing 5 pages and 8 components only | Must     |

## 7. Dependencies

| Dependency                              | Role                                          | Notes                             |
| --------------------------------------- | --------------------------------------------- | --------------------------------- |
| `tailwindcss` `^3.4.12`                 | Dark mode strategy change (`media` → `class`) | No version bump required          |
| `@heroicons/react` `^2.1.5`             | Icons for dark mode toggle button             | Already in project                |
| `clsx` `^2.1.1`                         | Conditional class merging for theme state     | Already in project                |
| `axe-core` (dev dependency, new)        | CLI accessibility audit for CI                | New dev dependency                |
| `@testing-library/react` `^16.0.1`      | Existing test harness                         | No change                         |
| `playwright` (existing in test harness) | Keyboard navigation E2E tests                 | New test files, no version change |
| `eslint` (existing)                     | `jsx-a11y` rule level change                  | No version bump required          |

## 8. Risks and Mitigations

| Risk                                                             | Likelihood | Impact | Mitigation                                                                     |
| ---------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------ |
| `jsx-a11y` strict mode reveals many existing violations          | High       | Medium | Run audit first, fix incrementally, commit rule change separately              |
| Dark mode toggle changes header layout slightly                  | Medium     | Low    | Design toggle to match existing header height/padding                          |
| Rich text renderer may not support semantic output customization | Medium     | High   | Wrap renderer with custom element mappings if needed                           |
| Color adjustments may shift brand appearance                     | Medium     | Low    | Provide before/after screenshots for review before committing                  |
| Focus trap adds complexity to mobile menu state management       | Medium     | Medium | Use existing `useState` in Header, test with Playwright keyboard scenarios     |
| Line-height/spacing changes affect layout on some pages          | Low        | Low    | Test all 5 pages after changes, use Tailwind responsive modifiers where needed |
| axe-core CLI adds CI execution time                              | Low        | Low    | Run only on changed pages or limit to critical routes                          |

## 9. Success Metrics

- **Zero WCAG 2.1 AA contrast violations** across all 5 pages (measured via axe-core or manual audit)
- **Zero `jsx-a11y` ESLint errors** at `strict` level
- **All interactive elements have visible focus indicators** with ≥ 3:1 contrast
- **Skip navigation link present and functional** on all pages
- **Mobile menu traps focus and restores it on close** (verified via Playwright E2E)
- **Single `<h1>` and sequential heading hierarchy** on all pages
- **All ARIA-labeled interactive elements** pass screen reader inspection
- **100% Jest test pass rate** (8 component snapshots, updated for toggle)
- **100% Playwright E2E test pass rate** (existing + new a11y tests)
- **Dark mode toggle persists preference** across page reloads and defaults to system preference

## 10. Out of Scope (Explicit)

- Migration from `package-lock.json` to another package manager
- Adding new pages, features, or components
- Introducing new font families, Google Fonts, or custom typography scales
- Building a new custom spacing scale or design system
- Colorblind mode or specialized accessibility features beyond WCAG 2.1 AA
- Screen reader content beyond ARIA labels
- Performance optimizations beyond a11y requirements
- Modifying external API integrations (Hygraph, Dev.to)

---

## 1. Product Vision

The personal website is a developer portfolio and personal brand presence hosted on Vercel. It currently runs on Next.js 14.2.21 with Tailwind CSS, but lacks a user-controlled dark mode toggle (system preference only), has un-audited color contrast, and is missing several WCAG 2.1 AA accessibility fundamentals. This PRD scopes a visual theming and accessibility overhaul that brings the site to WCAG 2.1 AA compliance — manual dark mode toggle, semantic HTML, ARIA labels, keyboard navigation with focus management, and visible focus indicators — while refining typography and spacing within the existing design system. No new pages, features, or technologies are introduced.

_Source: `openspec/changes/current/proposal.md` (Feature Brief); `openspec/specs/prd.md` §1–2._

## 2. Scope

### In Scope (v1)

| Area                  | Action                                                                                     | Source                                  |
| --------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------- |
| Dark mode             | Change Tailwind strategy `media` → `class`, add toggle in Header, localStorage persistence | proposal.md §Feature Scope              |
| Color palette         | Audit and fix all contrast violations to WCAG 2.1 AA (4.5:1 text, 3:1 UI/large text)       | proposal.md §Acceptance Criteria #2     |
| Typography            | Fix line-height (≥ 1.5 body) and letter-spacing within existing Tailwind utilities         | proposal.md §Feature Scope              |
| Spacing               | Fix inconsistent spacing between components and sections                                   | proposal.md §Feature Scope              |
| Skip navigation       | Add skip nav link to all pages                                                             | proposal.md §Acceptance Criteria #3     |
| Focus management      | Focus trap in mobile menu, focus restore on close                                          | proposal.md §Acceptance Criteria #4, #5 |
| ARIA labels           | Add to all interactive elements lacking descriptive text                                   | proposal.md §Acceptance Criteria #6     |
| Semantic HTML         | Single `<h1>` per page, sequential heading hierarchy, landmark regions                     | proposal.md §Acceptance Criteria #7     |
| Rich text a11y        | Ensure `/about` rich text renderer produces semantic HTML                                  | proposal.md §Acceptance Criteria #8     |
| ESLint                | Tighten `jsx-a11y` from `recommended` to `strict`                                          | proposal.md §Feature Scope              |
| Accessibility testing | axe-core CLI in CI, new Playwright E2E a11y tests                                          | proposal.md §Feature Scope              |
| Component scope       | All 5 pages (/, /about, /projects, /blog, /uses) and 8 components                          | proposal.md §Affected Areas             |

### Out of Scope

- Adding new pages, features, or components.
- Introducing new font families, Google Fonts, or custom typography scales.
- Building a new custom spacing scale or design system.
- Colorblind mode or specialized accessibility features beyond WCAG 2.1 AA.
- Screen reader content beyond ARIA labels.
- Performance optimizations beyond a11y requirements.
- Modifying external API integrations (Hygraph, Dev.to).
- Migration to a different package manager.

_Source: `openspec/changes/current/proposal.md` (Feature Scope, Out of scope); `openspec/specs/prd.md` §3, §10._

## 3. Feature List (Prioritized)

| #   | Feature                                                             | Priority | Source                       |
| --- | ------------------------------------------------------------------- | -------- | ---------------------------- |
| 1   | Change Tailwind dark mode strategy `media` → `class`                | P0       | proposal.md; prd.md FR-1     |
| 2   | Add dark mode toggle button in Header with localStorage persistence | P0       | proposal.md; prd.md FR-2     |
| 3   | Detect and default to system `prefers-color-scheme` on first visit  | P0       | proposal.md; prd.md FR-3     |
| 4   | Audit and fix all color contrast violations to WCAG 2.1 AA          | P0       | proposal.md; prd.md FR-4     |
| 5   | Add skip navigation link to all pages                               | P0       | proposal.md; prd.md FR-5     |
| 6   | Implement focus trap in mobile menu                                 | P0       | proposal.md; prd.md FR-6     |
| 7   | Implement focus restore on mobile menu close                        | P0       | proposal.md; prd.md FR-7     |
| 8   | Ensure visible focus indicators on all interactive elements         | P0       | proposal.md; prd.md FR-8     |
| 9   | Add ARIA labels to all interactive elements                         | P0       | proposal.md; prd.md FR-9     |
| 10  | Ensure single `<h1>` and sequential heading hierarchy               | P0       | proposal.md; prd.md FR-10    |
| 11  | Ensure landmark regions on all pages                                | P0       | proposal.md; prd.md FR-11    |
| 12  | Verify rich text renderer produces semantic HTML                    | P0       | proposal.md; prd.md FR-12    |
| 13  | Tighten ESLint `jsx-a11y` to `strict` and fix violations            | P0       | proposal.md; prd.md FR-13    |
| 14  | Fix line-height and letter-spacing for readability                  | P1       | proposal.md; prd.md FR-14    |
| 15  | Fix inconsistent spacing between components                         | P1       | proposal.md; prd.md FR-15    |
| 16  | Integrate axe-core CLI into CI                                      | P1       | proposal.md; prd.md FR-16    |
| 17  | Add Playwright E2E tests for keyboard navigation                    | P1       | proposal.md; prd.md FR-17    |
| 18  | All existing tests pass (updated snapshots)                         | P0       | proposal.md; prd.md FR-18–20 |

_Source: `openspec/changes/current/proposal.md` (Feature Scope, Acceptance Criteria); `openspec/specs/prd.md` §5._

## 4. Requirements & Scenarios

### Requirement: The dark mode toggle switches the site theme and persists the user's choice

#### Scenario: Toggle switches theme and persists

- GIVEN the user visits the site for the first time
- WHEN the user's system preference is light mode
- THEN the site renders in light mode by default
- WHEN the user clicks the dark mode toggle in the header
- THEN the site switches to dark mode
- WHEN the user reloads the page or navigates to another page
- THEN the site remains in dark mode (preference persisted in localStorage)
- WHEN the user's system preference changes
- THEN the toggle allows the user to override the system preference

_Source: proposal.md Acceptance Criteria #1; prd.md FR-1, FR-2, FR-3._

### Requirement: All text and interactive elements meet WCAG 2.1 AA color contrast ratios

#### Scenario: Color contrast audit passes

- GIVEN all pages are rendered in both light and dark modes
- WHEN text elements are measured for contrast ratio
- THEN normal text meets ≥ 4.5:1 contrast ratio
- AND large text (≥ 18pt or ≥ 14pt bold) meets ≥ 3:1 contrast ratio
- AND UI components (buttons, inputs, focus indicators) meet ≥ 3:1 contrast ratio
- WHEN the axe-core CLI audit runs in CI
- THEN zero WCAG AA contrast violations are reported

_Source: proposal.md Acceptance Criteria #2; prd.md FR-4, FR-16._

### Requirement: Keyboard-only users can navigate the entire site

#### Scenario: Tab navigation works on all pages

- GIVEN a user navigates via keyboard only (Tab, Shift+Tab, Enter, Escape)
- WHEN the user lands on any page
- THEN a skip navigation link is visible on first Tab press and jumps to main content
- WHEN the user tabs through all interactive elements
- THEN every element receives a visible focus indicator with ≥ 3:1 contrast against adjacent colors
- WHEN the user opens the mobile menu (on mobile viewport)
- THEN focus is trapped within the menu's focusable elements
- WHEN the user presses Escape or clicks the close button
- THEN the menu closes and focus returns to the toggle button

_Source: proposal.md Acceptance Criteria #3, #4, #5; prd.md FR-5, FR-6, FR-7, FR-8._

### Requirement: All pages use semantic HTML structure

#### Scenario: Heading hierarchy is correct

- GIVEN any page is rendered
- WHEN the HTML structure is inspected
- THEN there is exactly one `<h1>` element
- AND headings follow sequential order (no skipped levels, e.g., no `<h3>` after `<h1>`)
- AND landmark regions are present: `<main>`, `<nav>`, `<header>`, `<footer>`

#### Scenario: Rich text on /about is semantic

- GIVEN the /about page renders rich text content from Hygraph
- WHEN the rendered HTML is inspected
- THEN headings, lists, and paragraphs are semantic elements (`<h1>`–`<h6>`, `<ul>`, `<ol>`, `<li>`, `<p>`)
- AND no generic `<div>` or `<span>` wrappers replace semantic elements

_Source: proposal.md Acceptance Criteria #7, #8; prd.md FR-10, FR-11, FR-12._

### Requirement: All interactive elements have accessible labels

#### Scenario: ARIA labels on interactive elements

- GIVEN any page is rendered
- WHEN interactive elements (buttons, links, menu toggles) are inspected
- THEN every element has either visible text content or an `aria-label`/`aria-labelledby` attribute
- AND the label is descriptive of the element's purpose (not generic "click here")

_Source: proposal.md Acceptance Criteria #6; prd.md FR-9._

### Requirement: ESLint enforces strict accessibility rules with zero errors

#### Scenario: Lint passes at jsx-a11y strict level

- GIVEN the ESLint config has `jsx-a11y` set to `strict`
- WHEN `npm run lint` is executed
- THEN ESLint exits with zero errors
- AND no `jsx-a11y` violations remain in the codebase

_Source: proposal.md Acceptance Criteria #9; prd.md FR-13._

### Requirement: Accessibility tests are automated in CI and E2E suites

#### Scenario: axe-core audit runs in CI

- GIVEN a pull request is opened
- WHEN the CI pipeline executes
- THEN axe-core CLI audits all 5 pages for WCAG violations
- AND the CI job fails if any violations are detected

#### Scenario: Playwright a11y tests pass

- GIVEN the app is running in dev mode
- WHEN `npx playwright test` is executed
- THEN new a11y test files for keyboard navigation, focus states, and skip navigation pass

_Source: proposal.md Acceptance Criteria #9, #10; prd.md FR-16, FR-17._

### Requirement: Typography and spacing improvements enhance readability without changing the design system

#### Scenario: Readability improvements

- GIVEN body text is rendered on any page
- WHEN the CSS is inspected
- THEN line-height is ≥ 1.5
- AND letter-spacing is appropriate for readability (no tighter than default Tailwind)
- GIVEN spacing between components and sections
- WHEN the layout is inspected
- THEN spacing is consistent and uses existing Tailwind spacing utilities (no ad-hoc pixel values)

_Source: proposal.md Feature Scope (typography, spacing); prd.md FR-14, FR-15._

## 5. Non-Functional Requirements

_Source: `openspec/specs/prd.md` §6 (preserved and adapted for this feature)._ | ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | WCAG 2.1 AA compliance across all 5 pages | Must |
| NFR-2 | No functional regressions — all existing tests must pass | Must |
| NFR-3 | No changes to external API integrations (Hygraph, Dev.to) | Must |
| NFR-4 | No new font families or custom spacing scales introduced | Should |
| NFR-5 | Dark mode toggle adds minimal JS overhead (< 1KB gzipped) | Should |
| NFR-6 | Changes are scoped to existing 5 pages and 8 components only | Must |

## 6. Assumptions

| #   | Assumption                                                                                        | Source                                                                            | Rationale                                                                                |
| --- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| A1  | Tailwind CSS v3 supports `darkMode: 'class'` strategy without breaking changes                    | proposal.md (CSS architecture decision)                                           | Existing Tailwind 3.4.12 already supports class-based dark mode.                         |
| A2  | `@graphcms/rich-text-react-renderer` can be configured or wrapped to produce semantic HTML        | proposal.md Integration Concerns                                                  | If the renderer forces `<div>` wrappers, a custom renderer mapping will be needed.       |
| A3  | `@heroicons/react` provides suitable icons for the dark mode toggle (sun/moon)                    | proposal.md (icons already in use)                                                | No new icon dependency needed.                                                           |
| A4  | axe-core CLI can be integrated into the existing CI pipeline without significant overhead         | proposal.md (CI already runs lint + test)                                         | New dev dependency, fast execution on static pages.                                      |
| A5  | Playwright is already configured and available for E2E tests                                      | proposal.md (9 existing E2E test files)                                           | No new test infrastructure needed, just new test files.                                  |
| A6  | CSS custom properties in `globals.css` can be updated to support both light and dark theme colors | proposal.md (existing pattern: CSS custom properties + Tailwind `dark:` variants) | Existing architecture supports this; no changes needed.                                  |
| A7  | The existing 8 components and 5 pages cover all user-visible surface area                         | proposal.md (UI Surface section)                                                  | No new pages or components are added.                                                    |
| A8  | Color contrast adjustments can be achieved by tweaking existing Tailwind color values             | proposal.md (minor palette refinement decision)                                   | Full palette redesign is out of scope; adjustments stay within current color family.     |
| A9  | Skip navigation link does not visually disrupt the layout on mouse users                          | proposal.md (focus management scope)                                              | Skip link is visually hidden until focused (standard pattern).                           |
| A10 | Focus trap implementation can use a lightweight approach without new dependencies                 | proposal.md (focus management scope)                                              | Custom implementation using existing `useState` and event listeners in Header component. |

_Source: `openspec/changes/current/proposal.md` (Integration Concerns, Risks, Feature Scope decisions); `openspec/specs/prd.md` §3, §10._
