# Tech Stack — As-Is

## Languages & Runtime

- **TypeScript** — Strict mode enabled (`"strict": true` in `tsconfig.json`). All source files are `.ts` or `.tsx`.
- **JavaScript** — Present in `postcss.config.js`, `prettier.config.js` (CommonJS).
- **CSS** — Global styles in `src/styles/globals.css` with Tailwind directives and CSS custom properties.
- **Runtime:** Node.js (server-side rendering via Next.js App Router). No separate backend runtime.

## Frameworks & Libraries

- **Next.js 14.2.21** — App Router, Server Components, ISR with `revalidate: 600`. Configured in `package.json`, `next.config.mjs`, `next-env.d.ts`.
- **React 18.3.1** — UI library with `cache()` for ISR data caching. Configured in `package.json`.
- **Tailwind CSS 3.4.12** — Utility-first CSS framework. Configured in `tailwind.config.ts`, `postcss.config.js`.
- **graphql-request 7.1.0** — GraphQL client for Hygraph. Configured in `src/api/graphql.ts`.
- **@vercel/analytics** — Analytics integration. Used in `src/app/layout.tsx`.
- **@graphcms/rich-text-react-renderer 0.6.2** — Renders Hygraph rich text content. Used in `src/app/about/page.tsx`.
- **@heroicons/react 2.1.5** — Icon library.
- **react-social-icons 6.18.0** — Social media icons.
- **clsx 2.1.1** — Conditional CSS class merging. Used in `src/components/Header/Header.tsx`, `src/components/NavLinks/NavLinks.tsx`.
- **react-dom 18.3.1** — React DOM rendering.

## Database & ORM

**Not applicable.** This is a stateless static site with no local database or ORM. All data is fetched from external APIs (Hygraph GraphQL, Dev.to REST) at build/runtime.

## Authentication

**Not applicable for end users.** API authentication is server-side only:

- Hygraph: Bearer token via `HYGRAPH_AUTH_TOKEN` env var (in `src/api/graphql.ts`)
- Dev.to: API key via `DEVTO_KEY` env var (in `src/api/rest.ts`)
- No user authentication, no sessions, no JWT.

## Infrastructure & Deployment

- **Build:** `next build` (static site generation)
- **Dev:** `next dev --turbo` (turbo mode enabled)
- **Start:** `next start` (production server)
- **Deployment:** Vercel (implied by `@vercel/analytics` and sitemap URL `https://dineshharibabu.in`)
- **CI:** GitHub Actions (`.github/workflows/lint-test.yml`) — runs on PR to `main`, Ubuntu latest, Node 18.

## Testing

- **Jest 29.7.0** — Test runner with `ts-jest` transformer. Configured in `jest.config.ts`.
- **@testing-library/react 16.0.1** — Component testing utilities.
- **@testing-library/jest-dom 6.5.0** — DOM matchers (imported in `jest.setup.ts`).
- **jest-environment-jsdom 29.7.0** — JS DOM environment for testing React components.
- **babel-jest 29.7.0** — Babel transformer for Jest.
- **@types/jest 29.5.13** — TypeScript types for Jest.
- **Test coverage:** Snapshot tests for all 8 components in `src/components/*/`. SVG mocked in `__mocks__/svg.ts`.

## Tooling & CI

- **TypeScript 5** — Type checking and compilation. Configured in `tsconfig.json` with path aliases.
- **ESLint 8** — Linting with `next/core-web-vitals`, `@typescript-eslint/recommended`, `prettier`, `jsx-a11y`. Configured in `.eslintrc.json`.
- **Prettier 3.3.3** — Code formatting with `prettier-plugin-tailwindcss`, `@trivago/prettier-plugin-sort-imports`. Configured in `prettier.config.js`.
- **PostCSS 8** — CSS processing with Tailwind and Autoprefixer. Configured in `postcss.config.js`.
- **Autoprefixer 10.4.20** — CSS vendor prefixing.
- **@svgr/webpack 8.1.0** — SVG-to-React component conversion in webpack.
- **release-it** — Release automation (script present in `package.json`).
- **ts-node 10.9.2** — TypeScript execution for config files.
