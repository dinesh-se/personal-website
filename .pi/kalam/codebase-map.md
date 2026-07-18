# Codebase Map — Dinesh Haribabu Personal Website

## Tech Stack

**Languages:** TypeScript (strict mode), JavaScript, CSS
**Frameworks:** Next.js 14.2.21 (App Router), React 18.3.1, Tailwind CSS 3.4.12
**Package Manager:** npm (package-lock.json present)
**Runtime:** Node.js (server-side rendering via Next.js)

**Key Dependencies:**

- `next` — Framework (v14.2.21)
- `react` / `react-dom` — UI library (v18.3.1)
- `typescript` — Type checking (v5)
- `tailwindcss` — Utility CSS (v3.4.12)
- `graphql-request` — Hygraph GraphQL client (v7.1.0)
- `@vercel/analytics` — Analytics integration
- `@graphcms/rich-text-react-renderer` — Rich text rendering
- `@testing-library/react` — Component testing (v16.0.1)
- `jest` — Test runner (v29.7.0)
- `eslint` — Linting (v8)
- `prettier` — Code formatting (v3.3.3)

Configured in `package.json`, `tsconfig.json`, `tailwind.config.ts`.

## Architecture

**Pattern:** Next.js App Router with Server Components, ISR (Incremental Static Regeneration) with `revalidate: 600` on all pages. Static site generation — no local database.

**Module Boundaries:**

- `src/app/` — Page routes and layout (App Router)
- `src/components/` — Reusable UI components (8 components with barrel exports via `index.ts`)
- `src/api/` — Data fetching layer (graphql.ts for Hygraph, rest.ts for Dev.to)
- `src/types/` — TypeScript type definitions (author.ts, blog-post.ts, uses.ts, nav-links.ts, index.ts)
- `src/styles/` — Global CSS (globals.css with Tailwind directives and CSS custom properties)
- `public/` — Static assets (SVG icons, favicons)
- `__mocks__/` — Jest mock files (svg.ts)

**Entry Points:** `src/app/layout.tsx` (RootLayout), `src/app/page.tsx` (Home)

**Commands:**

- Dev: `npm run dev` → `next dev --turbo`
- Build: `npm run build` → `next build`
- Test: `npm test` → `jest`
- Lint: `npm run lint` → `next lint`
- Format: `npm run format` → `prettier --check`

**Path Aliases** (tsconfig.json): `@components/*`, `@api/*`, `@styles/*`, `@root/*`, `@types`

## Data Model

**No persistent data model — stateless service.** All data types are TypeScript interfaces in `src/types/`:

1. **Author** (`src/types/author.ts`): profile (fullName, summary, contactDetail, experience, displayPicture, moreDetails, githubRecentProjects, uses)
2. **BlogPost** (`src/types/blog-post.ts`): id, title, description, published_at, url, comments_count, public_reactions_count, page_views_count
3. **BlogPostUI** — Transformed UI shape with date: Date, commentsCount, reactionsCount, pageViewsCount
4. **Uses** (`src/types/uses.ts`): id, title, list of items
5. **NavLinks** (`src/types/nav-links.ts`): links array, styling props
6. **Link**: label, href

Data is fetched from Hygraph (GraphQL) and Dev.to (REST) at build/runtime — no migrations or seed data.

## API Surface

**External APIs:**

1. **Hygraph GraphQL** (`src/api/graphql.ts`)

   - Endpoint: `https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/{HYGRAPH_ADMIN_ID}/master`
   - Auth: Bearer token (HYGRAPH_AUTH_TOKEN env var)
   - Queries: `getUser`, `getMoreDetails`, `getRepos`, `getUses`
   - Returns: Author type with profile, experience, repositories, uses

2. **Dev.to REST** (`src/api/rest.ts`)
   - Endpoint: `https://dev.to/api/articles/me/published`
   - Auth: api-key header (DEVTO_KEY env var)
   - Returns: BlogPostUI[] (mapped from BlogPost)

**Internal Routes:**

- `/` — Home page (home)
- `/about` — About page (about)
- `/projects` — Projects page (projects)
- `/blog` — Blog page (blog)
- `/uses` — Uses page (uses)

**Metadata:**

- `src/app/robots.ts` — Allows all, points to sitemap
- `src/app/sitemap.ts` — 5 routes with monthly changeFrequency

## UI Surface

**5 Pages:**

- **Home** (`/`): Greeting, summary, contact buttons, recent projects grid, experience timeline
- **About** (`/about`): Bio with rich text renderer, display picture, tech stack logos, contact
- **Projects** (`/projects`): GitHub repository grid (3-column on desktop), project cards with language badges
- **Blog** (`/blog`): Dev.to articles list in grid layout
- **Uses** (`/uses`): Categorized list of developer tools/tech

**8 Components:**

- Header (nav with mobile menu toggle, logo, links)
- Footer (nav links + No Copyright link)
- NavLinks (reusable link list with active state via usePathname)
- Contact (social media buttons: LinkedIn, GitHub, email)
- Experience (organization timeline)
- BlogPostCard (blog post preview card)
- ProjectCard (project card with language info)
- RecentProjects (project grid container)

**Styling:** Tailwind CSS with dark mode via `prefers-color-scheme: dark` media query + `dark:` variants. CSS custom properties for theming in `src/styles/globals.css`. Responsive breakpoints: sm:, lg:

## Integrations

1. **Hygraph** (GraphQL CMS) — Content source for profile, experience, projects, uses. Configured via `HYGRAPH_ADMIN_ID`, `HYGRAPH_AUTH_TOKEN`, `HYGRAPH_USER_ID` env vars in `src/api/graphql.ts`.

2. **Dev.to** (REST API) — Blog posts source. Configured via `DEVTO_KEY` env var in `src/api/rest.ts`.

3. **Vercel Analytics** — Usage tracking via `<Analytics />` component in `src/app/layout.tsx`. No env vars required.

4. **@svgr/webpack** — SVG-to-React component conversion configured in `next.config.mjs` webpack rules.

5. **@heroicons/react** — Icon library (dependency present).

6. **@graphcms/rich-text-react-renderer** — Renders Hygraph rich text content on /about page.

7. **react-social-icons** — Social media icons (dependency present).

8. **clsx** — Conditional CSS class merging (used in Header, NavLinks).

## Conventions

**TypeScript:** Strict mode enabled (`"strict": true` in tsconfig.json). Path aliases for imports.

**ESLint:** Extends `next/core-web-vitals`, `plugin:@typescript-eslint/recommended`, `plugin:prettier/recommended`, `plugin:jsx-a11y/recommended`.

**Prettier:** singleQuote, semi, tabWidth 2, printWidth 80, trailingComma es5, importOrder with grouping (THIRD_PARTY_MODULES → @api → @components → @styles → @root → @types → relative), tailwindcss plugin, @trivago/prettier-plugin-sort-imports.

**Testing:** Jest 29.7 + @testing-library/react 16.0.1, jsdom environment, snapshot tests for all 8 components, SVG mocked to `'div'` in `__mocks__/svg.ts`, setup via `jest.setup.ts` (imports @testing-library/jest-dom).

**CSS:** Tailwind with `@tailwind base/components/utilities`, CSS custom properties for colors, dark mode via `@media (prefers-color-scheme: dark)`, @layer utilities for custom classes.

**Component Structure:** Barrel exports via `index.ts` in each component folder. PascalCase filenames. Server Components (async functions) for pages, Client Components (useState) for interactive components (Header).

**Data Fetching:** `cache()` wrapper from React for ISR. All pages export `revalidate = 600` (10 minutes).

**CI/CD:** `.github/workflows/lint-test.yml` — runs on PR to main, Ubuntu latest, Node 18, runs `npm run lint` and `npm test`.
