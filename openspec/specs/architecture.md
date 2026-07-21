# Architecture — Visual Theming & Accessibility

## 1. Module / Service Boundaries

This is a **single-module Next.js application** with internal module boundaries:

- **`src/app/`** — Page routes and root layout (Next.js App Router). Contains `layout.tsx`, `page.tsx`, and subdirectories for each route (`about/`, `blog/`, `projects/`, `uses/`). Also contains `robots.ts` and `sitemap.ts` for metadata.
- **`src/components/`** — Reusable UI components. Each component has its own directory with `Component.tsx`, `Component.test.tsx`, `__snapshots__/`, and `index.ts` (barrel export). Components: Header, Footer, NavLinks, Contact, Experience, BlogPostCard, ProjectCard, RecentProjects.
- **`src/api/`** — Data fetching layer. `graphql.ts` (Hygraph GraphQL client), `rest.ts` (Dev.to REST fetch). No local API routes.
- **`src/types/`** — TypeScript type definitions. `index.ts` re-exports all types. Files: `author.ts`, `blog-post.ts`, `uses.ts`, `nav-links.ts`.
- **`src/styles/`** — Global CSS (`globals.css`) with Tailwind directives and CSS custom properties for theming.
- **`public/`** — Static assets (SVG icons for tech stack logos, close/hamburger icons, logo, favicons).
- **`__mocks__/`** — Jest mock files (`svg.ts` mocks SVG imports for tests).

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No new modules introduced. The feature modifies existing modules for dark mode toggle, accessibility, and theming:

- `src/app/` — Dark mode state initialization in `layout.tsx`, skip navigation link, semantic HTML fixes in all 5 page files (source: `proposal.md`, "Affected Areas").
- `src/components/Header/` — Dark mode toggle button (client component), mobile menu focus trap and focus restore (source: `proposal.md`, "Affected Areas").
- `src/components/Footer/`, `NavLinks/`, `Contact/`, `Experience/`, `BlogPostCard/`, `ProjectCard/`, `RecentProjects/` — ARIA labels, focus indicators, semantic markup (source: `proposal.md`, "Affected Areas").
- `src/styles/globals.css` — CSS custom property updates for theme colors, focus indicator styles, skip nav styles (source: `proposal.md`, "Affected Areas").
- `tailwind.config.ts` — Dark mode strategy change (`media` → `class`), color palette adjustments (source: `proposal.md`, "Affected Areas").
- `eslint.config.js` — `jsx-a11y` plugin level `recommended` → `strict` (source: `proposal.md`, "Affected Areas").

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

**Feature impact (proposal: `openspec/changes/current/proposal.md`):**

- **Modified files:** `tailwind.config.ts` (dark mode strategy `media` → `class`, color palette), `src/styles/globals.css` (CSS custom properties, focus indicators, skip nav styles), `src/app/layout.tsx` (dark mode state, skip nav link), all 5 page files (semantic HTML), all 8 component files (ARIA labels, focus management), `eslint.config.js` (jsx-a11y strict)
- **New files:** `e2e/a11y-*.spec.ts` — Playwright E2E tests for keyboard navigation, focus states, skip navigation
- **Modified file:** `.github/workflows/lint-test.yml` — add axe-core CLI step for WCAG audit
- **New dev dependency:** `axe-core` — CLI accessibility audit for CI pipeline

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

**Feature impact (proposal: `openspec/changes/current/proposal.md`):**

- The data flow architecture is unchanged — same Next.js App Router, same Server Components, same ISR pattern, same external APIs (Hygraph, Dev.to).
- No new data sources or API changes (source: `proposal.md`, "Data Needs").
- The `@graphcms/rich-text-react-renderer` component on `/about` must produce semantic HTML output (headings, lists, paragraphs) — if the renderer forces `<div>` wrappers, a custom element mapping wrapper is needed (source: `proposal.md`, "Integration Concerns" → `@graphcms/rich-text-react-renderer`).

## 4. Authentication Flow

**No user authentication.** The app is a public static site. API authentication is server-side only:

- Hygraph: Bearer token from `HYGRAPH_AUTH_TOKEN` env var (never exposed to client).
- Dev.to: API key from `DEVTO_KEY` env var (never exposed to client).

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No changes to authentication flow. The feature does not modify auth mechanisms, env var handling, or expose any credentials to the client (source: `proposal.md`, "Out of scope" → "Modifying external API integrations").

## 5. Error Handling Strategy

- **REST API:** `src/api/rest.ts` checks `res.ok` and throws `Error('Failed to fetch blog posts')` on non-200 responses.
- **GraphQL:** `graphql-request` library handles GraphQL errors internally (throws on response errors).
- **Hybrid error pages:** Root-level `error.tsx` serves as a catch-all fallback. Route-specific `error.tsx` files are created for key routes where custom error UI adds value. All error pages use skeleton-based fallback UI consistent with the loading state pattern.
- **No try/catch in data fetching:** Server components propagate errors to Next.js error boundary.

**Upgrade impact (proposal: `openspec/changes/current/proposal.md`):** New error.tsx files added per route (hybrid pattern). Root `error.tsx` retained as catch-all. No changes to existing REST/GraphQL error propagation logic (source: `proposal.md`, "Affected Areas" → `src/app/` error.tsx).

## 6. Logging & Observability

- **Vercel Analytics:** `<Analytics />` component in `src/app/layout.tsx` tracks page views and user interactions. No custom logging.
- **No application logging:** No console.log statements in production code. No logging library configured.
- **No error tracking:** No Sentry, LogRocket, or similar integration.

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No changes to logging or observability. The `@vercel/analytics` component is unchanged (no version bump for this feature) (source: `proposal.md`, "Out of scope" → "Performance optimizations beyond a11y requirements").

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

**Feature impact (proposal: `openspec/changes/current/proposal.md`):**

- CI workflow updated: add axe-core CLI step to audit all 5 pages for WCAG AA violations on every PR (source: `proposal.md`, "Affected Areas" → CI/CD).
- No Node version changes, no `setup-node` changes for this feature.
- No new deployment services or topology changes (source: `proposal.md`, "Out of scope" → "Modifying external API integrations").

## 8. Cross-Cutting Concerns

- **Path Aliases:** `tsconfig.json` defines `@components/*`, `@api/*`, `@styles/*`, `@root/*`, `@types` for cleaner imports.
- **Import Ordering:** Prettier config enforces import order (THIRD_PARTY_MODULES → @api → @components → @styles → @root → @types → relative).
- **Dark Mode:** CSS custom properties in `:root` and `@media (prefers-color-scheme: dark)`. Tailwind `dark:` variants applied in components. Feature changes strategy from `media` to `class` — root `<html>` toggled via `class="dark"` by Header component, preference persisted in localStorage, defaults to system preference on first visit.
- **Responsive Design:** Tailwind breakpoints (sm:, lg:) with mobile-first approach. Header has mobile menu toggle.
- **SVG Processing:** `@svgr/webpack` in `next.config.mjs` converts SVG imports to React components. Jest mocks SVGs to `'div'`.
- **Image Optimization:** `next.config.mjs` restricts `images.remotePatterns` to `**.graphassets.com` (Hygraph CDN).
- **TypeScript Strict Mode:** `"strict": true` in `tsconfig.json`. No `skipLibCheck` for library types.
- **ESLint:** Uses flat config (`eslint.config.js`). Feature tightens `jsx-a11y` plugin level from `"recommended"` to `"strict"` (source: `proposal.md`, "Affected Areas" → `eslint.config.js`; "Feature Scope").

**Feature impact (proposal: `openspec/changes/current/proposal.md`):**

- **Dark mode strategy:** Tailwind `tailwind.config.ts` changes `darkMode` from `"media"` to `"class"`. Root `<html>` element gets `class="dark"` or `class=""` toggled by Header component via `useState` and persisted to localStorage (source: `proposal.md`, "Affected Areas" → `tailwind.config.ts`; "Integration Concerns" → Tailwind dark mode `class` strategy).
- **CSS custom properties:** `globals.css` updates theme colors for WCAG AA contrast compliance, adds focus indicator styles (`:focus-visible`), adds skip nav link styles (visually hidden until focused) (source: `proposal.md`, "Affected Areas" → `globals.css`).
- **ESLint jsx-a11y:** `eslint.config.js` changes `jsx-a11y` plugin level from `"recommended"` to `"strict"` (source: `proposal.md`, "Affected Areas" → `eslint.config.js`; "Feature Scope").
- **Jest snapshots:** Existing snapshot tests for 8 components will need updating (Header gets new toggle button) — not a config change, just snapshot regeneration (source: `proposal.md`, "Integration Concerns" → Existing snapshot tests).
- **axe-core CI:** New dev dependency added for CLI accessibility audits in `.github/workflows/lint-test.yml` (source: `proposal.md`, "Affected Areas" → CI/CD; "Feature Scope").
