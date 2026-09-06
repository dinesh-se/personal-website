# Architecture — Single-Page Homepage

## 1. Module / Service Boundaries

This is a **single-module Next.js application** with internal module boundaries:

- **`src/app/`** — Page routes and root layout (Next.js App Router). The site is a **single-page homepage**: `layout.tsx` (root layout) + `page.tsx` (the only route, `/`). Also contains `loading.tsx`, `error.tsx`, `robots.ts`, and `sitemap.ts` (single `/` entry). The former `about/`, `blog/`, and `uses/` subdirectories were removed.
- **`src/components/`** — Reusable UI components. Each component has its own directory with `Component.tsx`, `Component.test.tsx`, `__snapshots__/`, and `index.ts` (barrel export). Components: Header, Footer, NavLinks, Contact, BlogPostCard, Hero, About, Blog. (Experience was removed with the multi-page layout.)
- **`src/api/`** — Data fetching layer. `graphql.ts` (Hygraph GraphQL client, single `getProfile` query), `rest.ts` (Dev.to REST fetch). No local API routes.
- **`src/types/`** — TypeScript type definitions. `index.ts` re-exports all types. Files: `author.ts`, `blog-post.ts`, `nav-links.ts`. (`uses.ts` was removed.)
- **`src/styles/`** — Global CSS (`globals.css`) with Tailwind directives and CSS custom properties for theming.
- **`public/`** — Static assets (SVG icons for tech stack logos, close/hamburger icons, logo, favicons).
- **`__mocks__/`** — Jest mock files (`svg.ts` mocks SVG imports for tests).

## 2. Folder Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (Header, Footer, Analytics)
│   │   ├── page.tsx            # Single-page homepage (Hero, About, Blog, Contact)
│   │   ├── loading.tsx         # Skeleton loading state
│   │   ├── error.tsx           # Error boundary
│   │   ├── robots.ts           # Robots.txt metadata
│   │   ├── sitemap.ts          # Sitemap metadata (single '/' entry)
│   │   └── favicon.ico         # Favicon
│   ├── components/             # UI components
│   │   ├── Header/             # Sticky header with anchor nav (About/Writing/Contact)
│   │   ├── Footer/
│   │   ├── NavLinks/
│   │   ├── Contact/            # Social icon links + resume download
│   │   ├── BlogPostCard/       # Blog card used in the Writing section
│   │   ├── Hero/               # Photo + name + positioning
│   │   ├── About/              # Rich text bio + Interests
│   │   └── Blog/               # Latest 3 posts + "View all" link
│   ├── api/                    # Data fetching layer
│   │   ├── graphql.ts          # Hygraph GraphQL client (getProfile)
│   │   └── rest.ts             # Dev.to REST client
│   ├── types/                  # TypeScript types
│   │   ├── index.ts            # Re-exports all types
│   │   ├── author.ts           # Author/Profile types
│   │   ├── blog-post.ts        # BlogPost types
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
├── eslint.config.js            # ESLint flat config
├── prettier.config.js          # Prettier config
└── postcss.config.js           # PostCSS config
```

## 3. Data Flow

1. **Page Request:** User visits `/`.
2. **Server Component Execution:** Next.js renders the Server Component (`src/app/page.tsx`).
3. **Data Fetching:** Page calls `getProfile()` and `getBlogFeed()`.
4. **External API Call:** GraphQL client fetches profile from Hygraph; REST client fetches latest posts from Dev.to.
5. **Response Processing:** Data is mapped to TypeScript types (`BlogPost` → `BlogPostUI`).
6. **Caching:** `use cache` + `cacheLife('days'/'hours')` caches the result; the page is static with a 15m revalidate.
7. **Page Rendering:** Section components (Hero, About, Blog, Contact) receive data as props and render JSX.
8. **Anchor Navigation:** In-page anchor links (`#about`, `#writing`, `#contact`) scroll within the single page.

**Data Sources:**

- **Hygraph (GraphQL):** Profile (fullName, summary, interests, moreDetails, displayPicture, contactDetail) — fetched via `getProfile()` in `src/api/graphql.ts`.
- **Dev.to (REST):** Blog posts — fetched via `getBlogFeed()` (cached via `use cache` + `cacheLife('hours')`).

## 4. Authentication Flow

**No user authentication.** The app is a public static site. API authentication is server-side only:

- Hygraph: Bearer token from `HYGRAPH_AUTH_TOKEN` env var (never exposed to client).
- Dev.to: API key from `DEVTO_KEY` env var (never exposed to client).

## 5. Error Handling Strategy

- **REST API:** `src/api/rest.ts` checks `res.ok` and throws on non-200 responses; wrapped by `getBlogFetchResult` which classifies failures.
- **GraphQL:** `src/api/graphql.ts` returns `{ success: false, errorType }` via `classifyHygraphError` — never throws.
- **Graceful fallback:** `page.tsx` renders empty/fallback values on fetch failure rather than crashing. Root `error.tsx` + `loading.tsx` serve as catch-all boundary and skeleton state.

## 6. Logging & Observability

- **Vercel Analytics:** `<Analytics />` component in `src/app/layout.tsx` tracks page views and user interactions. No custom logging.
- **No application logging:** No console.log statements in production code.
- **No error tracking:** No Sentry, LogRocket, or similar integration.

## 7. Deployment Topology

- **Platform:** Vercel (implied by `@vercel/analytics` and domain `dineshharibabu.in`).
- **Build:** Static site generation via `next build`. The single route is prerendered as static content.
- **Hosting:** Static files served from Vercel edge network.
- **CI/CD:** GitHub Actions workflow (`.github/workflows/lint-test.yml`) runs on PR to `main`:
  1. Checkout code
  2. Setup Node.js 24
  3. `npm ci`
  4. `npm run lint`
  5. `npm test`
- **No separate staging/production environments:** Single deployment target. PR previews via Vercel.

## 8. Cross-Cutting Concerns

- **Path Aliases:** `tsconfig.json` defines `@components/*`, `@api/*`, `@styles/*`, `@root/*`, `@types` for cleaner imports.
- **Import Ordering:** Prettier config enforces import order (THIRD_PARTY_MODULES → @api → @components → @styles → @root → @types → relative).
- **Dark Mode:** Tailwind `class` strategy; root `<html>` toggled via `class="dark"` by Header component, preference persisted in localStorage, defaults to system preference on first visit.
- **Responsive Design:** Tailwind breakpoints (sm:, lg:) with mobile-first approach. Header has mobile menu toggle.
- **SVG Processing:** `@svgr/webpack` in `next.config.mjs` converts SVG imports to React components. Jest mocks SVGs to `'div'`.
- **Image Optimization:** `next.config.mjs` restricts `images.remotePatterns` to `**.graphassets.com` (Hygraph CDN).
- **TypeScript Strict Mode:** `"strict": true` in `tsconfig.json`.
- **ESLint:** Flat config (`eslint.config.js`) with `jsx-a11y` at `"strict"` level.
- **Rich Text Rendering:** `@graphcms/rich-text-react-renderer` renders `moreDetails` (Slate AST) in the About section with a custom element mapping (h1→h2, h2→h3, etc.) to keep heading levels semantic.
