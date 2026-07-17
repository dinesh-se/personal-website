# T-009 — Verify All Pages Render Correctly

**Milestone:** 3 — Test Verification

## Mission

Perform final verification that all 5 pages render correctly on the upgraded stack, including mobile menu functionality, navigation active-state highlighting, and dark mode rendering, with zero console errors. This is a vertical slice: verify end-to-end page rendering, interactions, and accessibility across all pages. This is the final acceptance step before the upgrade is considered complete.

## Covers features

- All 5 pages render without runtime errors
- Mobile menu toggles correctly
- Navigation active state highlights correctly
- Dark mode renders correctly on all pages

## Covers scenarios

- **US-3: As a visitor, I want all pages to load correctly on the upgraded stack so that my experience is unchanged.**
  - WHEN I visit the home page (`/`), THEN it renders with my greeting, summary, recent projects, and experience timeline.
  - WHEN I visit the about page (`/about`), THEN it renders my bio, display picture, and tech stack logos.
  - WHEN I visit the projects page (`/projects`), THEN it renders a grid of my GitHub projects.
  - WHEN I visit the blog page (`/blog`), THEN it renders my Dev.to published articles.
  - WHEN I visit the uses page (`/uses`), THEN it renders my developer tools and tech stack list.

- **US-4: As a visitor, I want the site to support dark mode so that I can read comfortably in low-light conditions.**
  - WHEN my system prefers dark mode, THEN all pages render with dark mode styles (CSS custom properties + Tailwind `dark:` variants).
  - WHEN I toggle the system theme, THEN the site responds correctly to the color scheme change.

- **US-5: As a visitor, I want the navigation to work correctly so that I can move between pages.**
  - WHEN I click a navigation link in the Header or Footer, THEN I am taken to the correct page.
  - WHEN I am on a page, THEN the corresponding navigation link is highlighted as active.
  - WHEN I am on a mobile device, THEN I can open and close the hamburger menu to access navigation links.

## Dependencies

- **Task:** T-008 (E2E tests must pass before final page rendering verification)

## Acceptance criteria

- [ ] All 5 pages (`/`, `/about`, `/projects`, `/blog`, `/uses`) render without JavaScript runtime errors
- [ ] Each page renders its expected content:
  - `/` — greeting, summary, recent projects, experience timeline
  - `/about` — bio, display picture, tech stack logos
  - `/projects` — grid of GitHub projects
  - `/blog` — Dev.to published articles
  - `/uses` — developer tools and tech stack list
- [ ] Mobile menu opens and closes correctly on mobile viewport
- [ ] Navigation active-state highlights correctly on all pages
- [ ] Dark mode renders correctly on all pages (via system preference or toggle)
- [ ] All 5 pages (`/`, `/about`, `/projects`, `/blog`, `/uses`) render without JavaScript runtime errors
- [ ] Each page renders its expected content (greeting, bio, project grid, articles, tech stack list)
- [ ] Mobile menu opens and closes correctly on mobile viewport
- [ ] Navigation active-state highlights correctly on all pages
- [ ] Dark mode renders correctly on all pages (via system preference or toggle)
- [ ] No console errors in browser dev tools when visiting any page
- [ ] Tests: Manual verification of all 5 pages in browser
- [ ] `npm run typecheck` and `npm run lint` pass

## User test

1. Run `npm run dev` — start the dev server
2. Visit each of the 5 pages in a browser:
   - `/` — verify greeting, summary, recent projects, experience timeline render
   - `/about` — verify bio, display picture, tech stack logos render
   - `/projects` — verify grid of GitHub projects renders
   - `/blog` — verify Dev.to articles render
   - `/uses` — verify developer tools and tech stack list render
3. Open browser dev tools — verify zero JavaScript console errors
4. Toggle dark mode (via system preference or toggle) — verify dark mode styles apply on all pages
5. Resize browser to mobile viewport — verify hamburger menu opens and closes
6. Navigate between pages — verify active navigation link highlights correctly

## Files likely touched

- None (this is a verification task; no code changes expected if previous tasks are complete)

## Do NOT

- Make any code changes (this is a verification task only)
- Add new features or pages
- Change visual design or styling
