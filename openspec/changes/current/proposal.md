# Feature Brief

**Feature:** Improve the site's visual theming (light/dark mode consistency, color palette, typography, spacing) and bring the app up to WCAG 2.1 AA accessibility standards (semantic HTML, color contrast, keyboard navigation, ARIA labels, focus states) across all pages.

## Feature Scope

### In Scope

- **Dark mode**: Replace `prefers-color-scheme`-only dark mode with a manual toggle button (stored in localStorage) that defaults to system preference. Change Tailwind dark mode strategy from `media` to `class`.
- **Color palette**: Audit all colors used across the site for WCAG 2.1 AA contrast compliance (4.5:1 for normal text, 3:1 for large text and UI components) on both light and dark backgrounds. Adjust custom colors in `tailwind.config.ts` and `globals.css` to meet thresholds.
- **Typography**: Keep current Tailwind font utilities. Fix line-height and letter-spacing values for improved readability (minimum 1.5 line-height for body text, appropriate letter-spacing for headings).
- **Spacing**: Use existing Tailwind spacing utilities. Fix inconsistent spacing between components and sections across all pages.
- **Semantic HTML**: Audit all 5 pages for proper heading hierarchy, landmark regions (`<main>`, `<nav>`, `<header>`, `<footer>`), and semantic elements (`<article>`, `<section>`, `<ul>`).
- **ARIA labels**: Add ARIA labels to all interactive elements (buttons, links, form controls, mobile menu toggle) where visual labels are insufficient or absent.
- **Focus states**: Ensure all interactive elements have visible focus indicators (minimum 3:1 contrast against adjacent colors). Add skip navigation link, focus trap in mobile menu (Header component), and focus restore on close.
- **Rich text accessibility**: Ensure `@graphcms/rich-text-react-renderer` output on `/about` produces semantic HTML (proper heading hierarchy, list elements, paragraph tags).
- **Accessibility testing**: Add axe-core CLI audit to CI pipeline and new Playwright E2E tests for keyboard navigation and color contrast verification.
- **ESLint**: Tighten `jsx-a11y` plugin from `recommended` to `strict`.

### Out of Scope

- New pages or features
- New font families or Google Fonts integration
- Custom spacing scale or design system
- Screen reader content beyond ARIA labels
- Colorblind mode or other specialized accessibility features
- Performance optimizations beyond a11y requirements

## Acceptance Criteria

1. **Dark mode toggle**: Given a user visits the site, when they click the dark mode toggle in the header, then the site switches to the opposite theme and the preference persists across page reloads and defaults to system preference on first visit.

2. **Color contrast**: Given any text or interactive element on any page, when measured with a color contrast tool, then the contrast ratio meets WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text ≥18pt or 14pt bold, 3:1 for UI components).

3. **Keyboard navigation**: Given a user navigates via keyboard only, when they tab through all interactive elements on any page, then focus is visible on every element, the mobile menu can be opened and closed, and no focus is trapped unexpectedly.

4. **Skip navigation**: Given a user presses Tab on page load, when they reach the first focusable element, then a skip navigation link is visible and jumping to the main content area.

5. **Semantic structure**: Given any page, when inspected for HTML structure, then it contains a single `<h1>`, heading hierarchy is sequential (no skipped levels), and landmark regions are present (`<main>`, `<nav>`, `<header>`, `<footer>`).

6. **ARIA labels**: Given any interactive element, when checked for ARIA attributes, then all buttons, links, and controls have descriptive labels (either visible text or `aria-label`/`aria-labelledby`).

7. **Focus management**: Given the mobile menu is open, when the user tabs through focusable elements, then focus is trapped within the menu. When the menu closes, then focus returns to the toggle button.

8. **Rich text semantics**: Given the `/about` page renders rich text content, when the output HTML is inspected, then headings, lists, and paragraphs are semantic elements (not wrapped in generic `<div>` or `<span>`).

9. **Linting**: Given the ESLint config, when `npm run lint` is run, then `jsx-a11y` rules at `strict` level pass without errors.

10. **Testing**: Given the test suite, when `npm test` and Playwright E2E tests are run, then new a11y tests for keyboard navigation and focus states pass.

## Affected Areas

- **`tailwind.config.ts`**: Dark mode strategy change (`media` → `class`), color palette adjustments, spacing fixes
- **`src/styles/globals.css`**: CSS custom property updates for theme colors, focus indicator styles, skip nav styles
- **`src/app/layout.tsx`**: Dark mode toggle state management, skip navigation link
- **`src/app/page.tsx`**, **`src/app/about/page.tsx`**, **`src/app/projects/page.tsx`**, **`src/app/blog/page.tsx`**, **`src/app/uses/page.tsx`**: Semantic HTML fixes, heading hierarchy, ARIA labels
- **`src/components/Header/`**: Dark mode toggle button, mobile menu focus trap and focus restore
- **`src/components/Footer/`**: Semantic structure, ARIA labels
- **`src/components/NavLinks/`**: ARIA labels, focus states
- **`src/components/Contact/`**: ARIA labels on social links, focus indicators
- **`src/components/Experience/`**: Semantic list structure, ARIA labels
- **`src/components/BlogPostCard/`**: Semantic markup, ARIA labels
- **`src/components/ProjectCard/`**: Semantic markup, ARIA labels
- **`src/components/RecentProjects/`**: Semantic list structure
- **`eslint.config.js`**: `jsx-a11y` plugin level `recommended` → `strict`
- **`e2e/`**: New accessibility test files for keyboard nav and focus management
- **CI/CD (`.github/workflows/lint-test.yml`)**: axe-core CLI integration

## Data Needs

None — uses existing integrations (Hygraph GraphQL, Dev.to REST). No new external data sources required.

## Integration Concerns

- **Tailwind dark mode `class` strategy**: Requires a `<html class="dark">` or `<html class="">` toggle on the root element. The Header component (client component with `useState`) will manage the toggle state and persist to localStorage. The layout (`layout.tsx`) will initialize the class based on system preference.
- **`@graphcms/rich-text-react-renderer`**: May require custom renderers to ensure semantic HTML output. The existing rich-text rendering on `/about` needs inspection to confirm it produces proper heading/list/paragraph elements.
- **ESLint jsx-a11y strict mode**: May surface existing violations that need fixing before the rule level change is merged.
- **Existing snapshot tests**: Component changes (especially Header with new toggle button) will break existing Jest snapshot tests — snapshots need updating.
- **Playwright E2E tests**: New a11y tests will run against all 5 pages; existing tests should remain unaffected.

## Risks

| Risk                                                             | Mitigation                                                                       |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `jsx-a11y` strict mode reveals many existing violations          | Run audit first, fix incrementally, commit rule change separately                |
| Dark mode toggle changes layout slightly (new button in header)  | Design toggle to match existing header height/padding                            |
| Rich text renderer may not support semantic output customization | Fork or wrap renderer with custom element mappings if needed                     |
| Color adjustments may shift brand appearance                     | Provide before/after screenshots for review before committing                    |
| Focus trap adds complexity to mobile menu state management       | Use existing `useState` in Header, test with Playwright keyboard scenarios       |
| Line-height/spacing changes may affect layout on some pages      | Test all 5 pages after changes, use Tailwind's responsive modifiers where needed |

## Open Questions

- dark-mode-strategy
- color-palette-scope
- typography-system
- spacing-scale
- focus-management-scope

## Next Steps

Write the feature brief to /home/dinesh-se/Dev/personal-website/openspec/changes/current/proposal.md, then call confirm_step_output.
