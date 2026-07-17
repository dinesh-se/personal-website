# Architecture — As-Is (Upgraded)

## 1. Module / Service Boundaries

This is a **single-module Next.js application** with internal module boundaries:

- **`src/app/`** — Page routes and root layout (Next.js App Router). Contains `layout.tsx`, `page.tsx`, and subdirectories for each route (`about/`, `blog/`, `projects/`, `uses/`). Also contains `robots.ts` and `sitemap.ts` for metadata.
- **`src/components/`** — Reusable UI components. Each component has its own directory with `Component.tsx`, `Component.test.tsx`, `__snapshots__/`, and `index.ts` (barrel export). Components: Header, Footer, NavLinks, Contact, Experience, BlogPostCard, ProjectCard, RecentProjects.
- **`src/api/`** — Data fetching layer. `graphql.ts` (Hygraph GraphQL client), `rest.ts` (Dev.to REST fetch). No local API routes.
- **`src/types/`** — TypeScript type definitions. `index.ts` re-exports all types. Files: `author.ts`, `blog-post.ts`, `uses.ts`, `nav-links.ts`.
- **`src/styles/`** — Global CSS (`globals.css`) with Tailwind directives and CSS custom properties for theming.
- **`public/`** — Static assets (SVG icons for tech stack logos, close/hamburger icons, logo, favicons).
- **`__mocks__/`** — Jest mock files (`svg.ts` mocks SVG imports for tests).

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):** No new modules introduced. The feature upgrades existing modules to newer versions:
- `src/app/` — May need adjustments for React 19 Server Component patterns and Next.js 16 API changes (source: `proposal.md`, "Affected Areas" → "Next.js config").
- `src/components/` — May need fixes for React 19 breaking changes (PropTypes removal, new hooks, context API changes, server component patterns) (source: `proposal.md`, "Affected Areas" → "Source code").
- `src/api/` — `graphql-request` version bump; verify compatibility with Next.js 16 server components (source: `proposal.md`, "Integration Concerns" → Hygraph GraphQL).
- `@graphcms/rich-text-react-renderer` — Verify v0.6.x+ compatibility with React 19; if not, check for v1.x release (source: `proposal.md`, "Integration Concerns" → `@graphcms/rich-text-react-renderer`).
- `react-social-icons` — Verify compatibility with React 19; if using deprecated APIs, update or pin version (source: `proposal.md`, "Integration Concerns" → `react-social-icons`).

## 2. Folder Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (Header, Footer, Analytics)
│   │   ├── page.tsx            # Home page
│   │   ├── about/page.tsx      # About page
│   │   ├── blog/page.tsx       # Blog page
│   │   ├── projects/page.tsx   # Projects page
│   │   ├── uses/page.tsx       # Uses page
│   │   ├── robots.ts           # Robots.txt metadata
│   │   ├── sitemap.ts          # Sitemap metadata
│   │   └── favicon.ico         # Favicon
│   ├── components/             # UI components (8 components)
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── NavLinks/
│   │   ├── Contact/
│   │   ├── Experience/
│   │   ├── BlogPostCard/
│   │   ├── ProjectCard/
│   │   └── RecentProjects/
│   ├── api/                    # Data fetching layer
│   │   ├── graphql.ts          # Hygraph GraphQL client
│   │   └── rest.ts             # Dev.to REST client
│   ├── types/                  # TypeScript types
│   │   ├── index.ts            # Re-exports all types
│   │   ├── author.ts           # Author/Profile types
│   │   ├── blog-post.ts        # BlogPost types
│   │   ├── uses.ts             # Uses types
│   │   └── nav-links.ts        # NavLinks types
│   └── styles/
│       └── globals.css         # Global CSS with Tailwind
├── public/                     # Static assets
├── __mocks__/                  # Jest mocks
├── .github/workflows/          # CI/CD
│   └── lint-test.yml           # Lint + test on PR
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── next.config.mjs             # Next.js config
├── tailwind.config.ts          # Tailwind config
├── jest.config.ts              # Jest config
├── eslint.config.js            # ESLint flat config (replaces .eslintrc.json)
├── prettier.config.js          # Prettier config
└── postcss.config.js           # PostCSS config
```

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):**
- **New file:** `eslint.config.js` — replaces `.eslintrc.json` with ESLint v9 flat config format (source: `proposal.md`, "In scope" → "Migrate ESLint from v8 to v9 with flat config").
- **Removed file:** `.eslintrc.json` — legacy ESLint v8 config replaced by flat config (source: `proposal.md`, "Affected Areas" → "ESLint").
- **Modified file:** `.github/workflows/lint-test.yml` — Node version 18→24, `setup-node` action v2→v4 (source: `proposal.md`, "In scope" → "Update CI workflow").

## 3. Data Flow

1. **Page Request:** User navigates to a route (e.g., `/about`).
2. **Server Component Execution:** Next.js renders the Server Component (e.g., `src/app/about/page.tsx`).
3. **Data Fetching:** Page calls a data function (e.g., `getMoreDetails()` from `src/api/graphql.ts`).
4. **External API Call:** GraphQL client fetches from Hygraph endpoint, or REST client fetches from Dev.to.
5. **Response Processing:** Data is mapped to TypeScript types (e.g., `BlogPost` → `BlogPostUI`).
6. **Caching:** `cache()` wrapper from React caches the result for ISR.
7. **Page Rendering:** Component receives data as props and renders JSX.
8. **ISR Revalidation:** All pages export `revalidate = 600` (10 minutes), triggering background revalidation.

**Data Sources:**

- **Hygraph (GraphQL):** Profile, experience, projects, uses — fetched via `getUser()`, `getMoreDetails()`, `getRepos()`, `getUses()`.
- **Dev.to (REST):** Blog posts — fetched via `getBlogPosts()`.

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):**
- The data flow architecture is unchanged — same Next.js App Router, same Server Components, same ISR pattern.
- `graphql-request` version bump: verify the library's `fetch`-based client remains compatible with Next.js 16's server component execution model (source: `proposal.md`, "Integration Concerns" → Hygraph GraphQL).
- No new data sources or migration scripts required (source: `proposal.md`, "Data Needs").
- The `@graphcms/rich-text-react-renderer` component on `/about` may need version adjustment for React 19 compatibility (source: `proposal.md`, "Integration Concerns" → `@graphcms/rich-text-react-renderer`).

## 4. Authentication Flow

**No user authentication.** The app is a public static site. API authentication is server-side only:

- Hygraph: Bearer token from `HYGRAPH_AUTH_TOKEN` env var (never exposed to client).
- Dev.to: API key from `DEVTO_KEY` env var (never exposed to client).

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):** No changes to authentication flow. The feature does not modify auth mechanisms, env var handling, or expose any credentials to the client (source: `proposal.md`, "Out of scope" → "Changing external API integrations").

## 5. Error Handling Strategy

- **REST API:** `src/api/rest.ts` checks `res.ok` and throws `Error('Failed to fetch blog posts')` on non-200 responses.
- **GraphQL:** `graphql-request` library handles GraphQL errors internally (throws on response errors).
- **No custom error pages:** Next.js default error handling applies. No `error.tsx` or `not-found.tsx` in any route.
- **No try/catch in data fetching:** Server components propagate errors to Next.js error boundary.

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):** No new error handling paths introduced. The feature may surface existing latent issues (TypeScript errors, lint errors, test failures) but does not add new error categories (source: `proposal.md`, "Out of scope" → "Rewriting application logic or components").

## 6. Logging & Observability

- **Vercel Analytics:** `<Analytics />` component in `src/app/layout.tsx` tracks page views and user interactions. No custom logging.
- **No application logging:** No console.log statements in production code. No logging library configured.
- **No error tracking:** No Sentry, LogRocket, or similar integration.

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):** No changes to logging or observability. The feature upgrades `@vercel/analytics` from v1 to v2, which is a drop-in replacement (source: `proposal.md`, "Integration Concerns" → Vercel Analytics).

## 7. Deployment Topology

- **Platform:** Vercel (implied by `@vercel/analytics` and domain `dineshharibabu.in`).
- **Build:** Static site generation via `next build`. All pages are pre-rendered at build time with ISR revalidation.
- **Hosting:** Static files served from Vercel edge network.
- **CI/CD:** GitHub Actions workflow (`.github/workflows/lint-test.yml`) runs on PR to `main`:
  1. Checkout code
  2. Setup Node.js 24 (upgraded from 18)
  3. `npm ci`
  4. `npm run lint`
  5. `npm test`
- **No separate staging/production environments:** Single deployment target.

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):**
- CI workflow updated: Node version 18→24, `setup-node` action v2→v4 (source: `proposal.md`, "In scope" → "Update CI workflow").
- Node 24 on `ubuntu-latest` runner is supported by `setup-node@v4` (source: `proposal.md`, "Risks" → Node 24 in CI).
- No new deployment services or topology changes (source: `proposal.md`, "Out of scope" → "Changing external API integrations").

## 8. Cross-Cutting Concerns

- **Path Aliases:** `tsconfig.json` defines `@components/*`, `@api/*`, `@styles/*`, `@root/*`, `@types` for cleaner imports.
- **Import Ordering:** Prettier config enforces import order (THIRD_PARTY_MODULES → @api → @components → @styles → @root → @types → relative).
- **Dark Mode:** CSS custom properties in `:root` and `@media (prefers-color-scheme: dark)`. Tailwind `dark:` variants applied in components.
- **Responsive Design:** Tailwind breakpoints (sm:, lg:) with mobile-first approach. Header has mobile menu toggle.
- **SVG Processing:** `@svgr/webpack` in `next.config.mjs` converts SVG imports to React components. Jest mocks SVGs to `'div'`.
- **Image Optimization:** `next.config.mjs` restricts `images.remotePatterns` to `**.graphassets.com` (Hygraph CDN).
- **TypeScript Strict Mode:** `"strict": true` in `tsconfig.json`. No `skipLibCheck` for library types.
- **ESLint:** Migrated from v8 (`.eslintrc.json`) to v9 with flat config (`eslint.config.js`). Uses `@eslint/js` flat config template with `@typescript-eslint`, `prettier`, and `jsx-a11y` rules (source: `proposal.md`, "In scope" → "Migrate ESLint from v8 to v9 with flat config"; "Risks" → ESLint 9 flat config migration).

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):**
- **ESLint flat config:** Full migration from legacy `.eslintrc.json` to `eslint.config.js` (source: `proposal.md`, "Affected Areas" → "ESLint"; "In scope" → "Migrate ESLint from v8 to v9 with flat config").
- **ESLint config package:** `eslint-config-next` upgraded to match Next.js 16, requiring ESLint 9 (source: `proposal.md`, "In scope" → "Upgrade `eslint-config-next` to match Next.js 16").
- **TypeScript config:** `tsconfig.json` may need updates for React 19 types and Next.js 16 compiler changes (source: `proposal.md`, "Affected Areas" → "TypeScript").
- **Jest config:** `jest.config.ts`, `jest.setup.ts`, and `babel.config.json` may need updates for React 19 testing and `ts-jest` compatibility (source: `proposal.md`, "Affected Areas" → "Jest").
- **Tailwind CSS:** May need updates if upgrading to Tailwind CSS v4 (source: `proposal.md`, "Affected Areas" → "CSS"; "Risks" → Next.js 15/16 webpack config changes).
