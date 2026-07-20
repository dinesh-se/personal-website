# Tech Stack

## Selection Methodology

This codebase is an existing project. The baseline stack was established during onboarding and is documented in `.pi/kalam/baseline/tech-stack.md`. This feature (`openspec/changes/current/proposal.md`) scopes visual theming improvements and WCAG 2.1 AA accessibility compliance across all 5 pages and 8 components. It explicitly excludes adding new pages, features, or components. One new dev dependency is introduced (`axe-core` for CI accessibility audits); all other changes use the existing stack. No version bumps are applied.

## Summary Table

| Layer                  | Choice                                                          | Why                                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language & Runtime** | TypeScript (strict) + Node.js                                   | Existing stack; TypeScript 5 with `strict: true` on all `.ts`/`.tsx` files. No version changes.                                                          |
| **Framework**          | Next.js 14.2.21 (App Router)                                    | Existing framework; no version change. App Router, Server Components, ISR with `revalidate: 600`.                                                        |
| **UI Library**         | React 18.3.1                                                    | Existing library; no version change.                                                                                                                     |
| **CSS**                | Tailwind CSS 3.4.12 + PostCSS + Autoprefixer                    | Existing stack. `tailwind.config.ts`, `postcss.config.js`, `globals.css` with CSS custom properties. Dark mode strategy changes from `media` to `class`. |
| **GraphQL Client**     | graphql-request 7.1.0                                           | Existing; no version change. Connects to Hygraph.                                                                                                        |
| **Rich Text**          | @graphcms/rich-text-react-renderer 0.6.2                        | Existing; no version change. Used on /about page. Semantic HTML output must be verified/ensured.                                                         |
| **Icons**              | @heroicons/react 2.1.5 + react-social-icons 6.18.0              | Existing; no version change. Sun/moon icons used for dark mode toggle.                                                                                   |
| **Analytics**          | @vercel/analytics 1.x                                           | Existing; no version change.                                                                                                                             |
| **Testing**            | Jest 29.7.0 + @testing-library/react 16.0.1 + Playwright 1.61.1 | Existing test harness; no version change. Snapshot tests for 8 components + 9 E2E test files in `e2e/`. New a11y E2E test files added.                   |
| **Linting**            | ESLint 8 (flat config)                                          | Existing linter; no version change. `jsx-a11y` plugin level changed from `recommended` to `strict`.                                                      |
| **Formatting**         | Prettier 3.3.3 + plugins                                        | Existing stack; no version change.                                                                                                                       |
| **CI/CD**              | GitHub Actions (ubuntu-latest, Node 18→24)                      | Existing; no change for this feature.                                                                                                                    |
| **Deployment**         | Vercel                                                          | Existing (implied by `@vercel/analytics` and sitemap URL). No change.                                                                                    |
| **New Dev Dependency** | axe-core                                                        | CLI accessibility audit for CI pipeline. Used to enforce WCAG AA compliance on every PR.                                                                 |
| **Database/ORM**       | None                                                            | Stateless static site; data from Hygraph GraphQL and Dev.to REST APIs.                                                                                   |

## Constraints & Trade-offs

- **Dark mode strategy change (`media` → `class`)** — Requires `<html class="dark">` toggle on the root element. The Header component (client component with `useState`) manages the toggle state; `layout.tsx` initializes based on system preference. No breaking changes to existing Tailwind `dark:` variants.
- **`@graphcms/rich-text-react-renderer` semantic output** — The existing renderer on `/about` must produce semantic HTML (headings, lists, paragraphs) rather than generic `<div>` wrappers. If the renderer doesn't support this, a custom element mapping wrapper is needed.
- **`jsx-a11y` strict mode** — Tightening from `recommended` to `strict` will surface existing violations. Mitigation: audit first, fix incrementally, commit rule change after all violations are resolved.
- **axe-core as new dependency** — The only genuinely new dependency. Added as a dev dependency for CI accessibility audits. Execution time is bounded (static pages, fast CLI).
- **Snapshot test updates** — Header component changes (new toggle button) will break existing Jest snapshots. Snapshots are updated as part of the feature, not a regression.
- **No new technologies introduced beyond axe-core** — All other changes use existing Tailwind CSS, existing dependencies (`@heroicons/react`, `clsx`), and existing test infrastructure (Playwright, Jest). No framework, runtime, or database changes.
