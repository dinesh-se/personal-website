# Architecture — As-Is

## 1. Module / Service Boundaries

This is a **single-module Next.js application** with internal module boundaries:

- **`src/app/`** — Page routes and root layout (Next.js App Router). Contains `layout.tsx`, `page.tsx`, and subdirectories for each route (`about/`, `blog/`, `projects/`, `uses/`). Also contains `robots.ts` and `sitemap.ts` for metadata.
- **`src/components/`** — Reusable UI components. Each component has its own directory with `Component.tsx`, `Component.test.tsx`, `__snapshots__/`, and `index.ts` (barrel export). Components: Header, Footer, NavLinks, Contact, Experience, BlogPostCard, ProjectCard, RecentProjects.
- **`src/api/`** — Data fetching layer. `graphql.ts` (Hygraph GraphQL client), `rest.ts` (Dev.to REST fetch). No local API routes.
- **`src/types/`** — TypeScript type definitions. `index.ts` re-exports all types. Files: `author.ts`, `blog-post.ts`, `uses.ts`, `nav-links.ts`.
- **`src/styles/`** — Global CSS (`globals.css`) with Tailwind directives and CSS custom properties for theming.
- **`public/`** — Static assets (SVG icons for tech stack logos, close/hamburger icons, logo, favicons).
- **`__mocks__/`** — Jest mock files (`svg.ts` mocks SVG imports for tests).

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
├── .eslintrc.json              # ESLint config
├── prettier.config.js          # Prettier config
└── postcss.config.js           # PostCSS config
```

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

## 4. Authentication Flow

**No user authentication.** The app is a public static site. API authentication is server-side only:

- Hygraph: Bearer token from `HYGRAPH_AUTH_TOKEN` env var (never exposed to client).
- Dev.to: API key from `DEVTO_KEY` env var (never exposed to client).

## 5. Error Handling Strategy

- **REST API:** `src/api/rest.ts` checks `res.ok` and throws `Error('Failed to fetch blog posts')` on non-200 responses.
- **GraphQL:** `graphql-request` library handles GraphQL errors internally (throws on response errors).
- **No custom error pages:** Next.js default error handling applies. No `error.tsx` or `not-found.tsx` in any route.
- **No try/catch in data fetching:** Server components propagate errors to Next.js error boundary.

## 6. Logging & Observability

- **Vercel Analytics:** `<Analytics />` component in `src/app/layout.tsx` tracks page views and user interactions. No custom logging.
- **No application logging:** No console.log statements in production code. No logging library configured.
- **No error tracking:** No Sentry, LogRocket, or similar integration.

## 7. Deployment Topology

- **Platform:** Vercel (implied by `@vercel/analytics` and domain `dineshharibabu.in`).
- **Build:** Static site generation via `next build`. All pages are pre-rendered at build time with ISR revalidation.
- **Hosting:** Static files served from Vercel edge network.
- **CI/CD:** GitHub Actions workflow (`.github/workflows/lint-test.yml`) runs on PR to `main`:
  1. Checkout code
  2. Setup Node.js 18
  3. `npm ci`
  4. `npm run lint`
  5. `npm test`
- **No separate staging/production environments:** Single deployment target.

## 8. Cross-Cutting Concerns

- **Path Aliases:** `tsconfig.json` defines `@components/*`, `@api/*`, `@styles/*`, `@root/*`, `@types` for cleaner imports.
- **Import Ordering:** Prettier config enforces import order (THIRD_PARTY_MODULES → @api → @components → @styles → @root → @types → relative).
- **Dark Mode:** CSS custom properties in `:root` and `@media (prefers-color-scheme: dark)`. Tailwind `dark:` variants applied in components.
- **Responsive Design:** Tailwind breakpoints (sm:, lg:) with mobile-first approach. Header has mobile menu toggle.
- **SVG Processing:** `@svgr/webpack` in `next.config.mjs` converts SVG imports to React components. Jest mocks SVGs to `'div'`.
- **Image Optimization:** `next.config.mjs` restricts `images.remotePatterns` to `**.graphassets.com` (Hygraph CDN).
- **TypeScript Strict Mode:** `"strict": true` in `tsconfig.json`. No `skipLibCheck` for library types.
