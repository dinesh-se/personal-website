# Tech Stack

## Selection Methodology

This codebase is an existing project. The baseline stack was established during onboarding and is documented in `.pi/kalam/baseline/tech-stack.md`. This feature (`openspec/changes/current/proposal.md`) scopes a dependency upgrade — Next.js 14→16, React 18→19, ESLint 8→9, Node 18→24, and related version bumps — and explicitly excludes adding new features, pages, or technologies. No genuinely new technology is introduced by this feature. All choices below are carried over from the existing stack unchanged.

## Summary Table

| Layer                  | Choice                                                          | Why                                                                                                                                                |
| ---------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language & Runtime** | TypeScript (strict) + Node.js                                   | Existing stack; TypeScript 5 with `strict: true` on all `.ts`/`.tsx` files. Node version bumps 18→24 per proposal.                                 |
| **Framework**          | Next.js 14→16 (App Router)                                      | Existing framework; upgraded per proposal to latest stable. App Router, Server Components, ISR with `revalidate: 600`.                             |
| **UI Library**         | React 18→19                                                     | Existing UI library; upgraded per proposal to latest stable.                                                                                       |
| **CSS**                | Tailwind CSS 3.4.12 + PostCSS + Autoprefixer                    | Existing stack. `tailwind.config.ts`, `postcss.config.js`, `globals.css` with CSS custom properties.                                               |
| **GraphQL Client**     | graphql-request 7.1.0                                           | Existing; version bumped per proposal. Connects to Hygraph.                                                                                        |
| **Rich Text**          | @graphcms/rich-text-react-renderer 0.6.2                        | Existing; version bumped per proposal. Used on /about page.                                                                                        |
| **Icons**              | @heroicons/react 2.1.5 + react-social-icons 6.18.0              | Existing; version bumped per proposal.                                                                                                             |
| **Analytics**          | @vercel/analytics 1→2                                           | Existing; upgraded per proposal to 2.x.                                                                                                            |
| **Testing**            | Jest 29.7.0 + @testing-library/react 16.0.1 + Playwright 1.61.1 | Existing test harness; versions bumped per proposal. Snapshot tests for 8 components + 9 E2E test files in `e2e/`.                                 |
| **Linting**            | ESLint 8→9 (flat config)                                        | Existing linter; migrated from `.eslintrc.json` to `eslint.config.js` per proposal. TypeScript-eslint packages updated for ESLint 9 compatibility. |
| **Formatting**         | Prettier 3.3.3 + plugins                                        | Existing stack; version bumped per proposal.                                                                                                       |
| **CI/CD**              | GitHub Actions (ubuntu-latest, Node 18→24)                      | Existing; `setup-node` action bumped v2→v4 to support Node 24 per proposal.                                                                        |
| **Deployment**         | Vercel                                                          | Existing (implied by `@vercel/analytics` and sitemap URL). No change.                                                                              |
| **Database/ORM**       | None                                                            | Stateless static site; data from Hygraph GraphQL and Dev.to REST APIs.                                                                             |

## Constraints & Trade-offs

- **React 19 compatibility with existing libraries** — `@graphcms/rich-text-react-renderer` and `react-social-icons` must be verified compatible with React 19. If either is incompatible, the proposal's risk matrix flags pinning to a React 18-compatible version or forking as the mitigation. This is the primary technical risk of the upgrade.
- **ESLint 9 flat config migration** — Moving from `.eslintrc.json` to `eslint.config.js` requires re-mapping all existing rules. The proposal mitigates by starting from the `@eslint/js` flat config template and migrating rules incrementally. A fallback to ESLint 8 with flat config is noted if the full migration proves difficult.
- **Node 24 in CI** — `setup-node@v4` is required (v2 does not support Node 24). CI runner is `ubuntu-latest`, which supports Node 24, so this is low risk.
- **No new technologies introduced** — Every dependency in scope is already present in the baseline stack. The feature only changes versions and one configuration format (ESLint). No new libraries, runtimes, databases, or services are added.
