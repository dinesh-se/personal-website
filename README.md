# Dinesh Haribabu — Personal Website

Single-page homepage for **Dinesh Haribabu** — frontend developer based in Dublin, Ireland.

Built with **Next.js (App Router)** and **Tailwind CSS**, pulling content from **Hygraph** (profile) and **Dev.to** (latest blog posts). Deployed on **Vercel**.

## Features

- **Single-page layout** (`/` route) with sections:
  - **Hero** — photo, name, positioning
  - **About** — rich-text bio (`moreDetails`) + Interests
  - **Writing** — 3 latest blog posts from Dev.to
  - **Contact** — email / LinkedIn / GitHub + resume download
- **In-page anchor navigation** (About / Writing / Contact)
- **Dark mode** with system-preference default, persisted to localStorage
- **WCAG 2.1 AA** accessibility (skip nav, focus management, semantic HTML)
- **ISR + `use cache`** caching for profile and blog feeds

## Tech Stack

| Layer       | Tech                                   |
| ----------- | -------------------------------------- |
| Framework   | Next.js 16 (App Router)                |
| Styling     | Tailwind CSS                           |
| CMS         | Hygraph (GraphQL)                      |
| Blog posts  | Dev.to REST API                        |
| Testing     | Jest (unit/component/snapshot), Playwright (e2e) |
| Linting     | ESLint (flat config, jsx-a11y strict), Prettier |
| Deployment  | Vercel                                 |
| CI/CD       | GitHub Actions (lint + test on PR)     |

## Getting Started

```bash
npm install
# copy .env.example → .env and fill in HYGRAPH_AUTH_TOKEN, HYGRAPH_USER_ID, HYGRAPH_ADMIN_ID, DEVTO_KEY
npm run dev
```

Open <http://localhost:3000>.

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # ESLint
npm test          # Jest unit/component tests
npm run typecheck # TypeScript type check
npx playwright test # End-to-end tests
```

## Routes

The site is a **single-page homepage** — the only route is `/` (plus `/_not-found`, the Dev.to proxy API route, `robots.txt`, and `sitemap.xml`). The former `/about`, `/blog`, and `/uses` routes were removed.

## Content Management

Profile content (summary, `moreDetails` rich text, interests, contact) is managed in **Hygraph** and published to the PUBLISHED stage. The home page fetches it via the single `getProfile` query in `src/api/graphql.ts`.

## Docs

- [`docs/cms-setup.md`](docs/cms-setup.md) — high-level guidance on setting up the CMS and the content expected per section.

Architecture and API contracts are documented under [`openspec/specs/`](openspec/specs/):

- [`api-spec.md`](openspec/specs/api-spec.md)
- [`architecture.md`](openspec/specs/architecture.md)
- [`data-model.md`](openspec/specs/data-model.md)
