# Task T-003: generateMetadata Migration

## Goal

Migrate all routes from static `export const metadata` (root layout) and standalone `robots.ts`/`sitemap.ts` to per-route `generateMetadata` functions, following Next.js 16 App Router conventions.

## Background

The current codebase uses:

- **Root layout** (`src/app/layout.tsx`): Static `export const metadata` with title, description, and authors
- **`src/app/robots.ts`**: Static export returning `MetadataRoute.Robots`
- **`src/app/sitemap.ts`**: Static export returning `MetadataRoute.Sitemap`

The proposal specifies migrating all routes to `generateMetadata` functions. This is the modern Next.js pattern that allows dynamic metadata generation per route.

### Current Root Layout Metadata

```typescript
export const metadata: Metadata = {
  title: 'Dinesh Haribabu',
  description: 'A front-end web developer focused on crafting clean and intuitive interfaces providing better UX.',
  authors: [{ name: 'Dinesh Haribabu', url: 'https://dineshharibabu.in/' }],
};
```

### Current robots.ts

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://dineshharibabu.in/sitemap.xml',
  };
}
```

### Current sitemap.ts

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/projects', '/blog', '/uses'];
  return routes.map((path) => ({
    url: `https://dineshharibabu.in${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path ? 0.8 : 1,
  }));
}
```

## Scope

### Files to Create

1. `src/app/about/page.tsx` — Add `generateMetadata` function
2. `src/app/blog/page.tsx` — Add `generateMetadata` function
3. `src/app/projects/page.tsx` — Add `generateMetadata` function
4. `src/app/uses/page.tsx` — Add `generateMetadata` function

### Files to Modify

1. `src/app/layout.tsx` — Replace static `export const metadata` with `generateMetadata` function
2. `src/app/robots.ts` — Convert to `generateMetadata` or remove (robots can be generated via `generateMetadata` in layout)
3. `src/app/sitemap.ts` — Convert to `generateMetadata` or remove (sitemap can be generated via `generateMetadata` in layout)

### Files to NOT Modify

- All existing component files
- Data fetching logic
- Page JSX structure

## Acceptance Criteria
> ✅ Verified 2026-07-19

- [x] Root `layout.tsx` uses `generateMetadata` instead of static `export const metadata`
- [x] All 5 routes (`/`, `/about`, `/projects`, `/blog`, `/uses`) have `generateMetadata` functions
- [x] Each route's metadata includes a page-specific title (e.g., "About me — Dinesh Haribabu") and description
- [x] `robots.ts` is either removed or converted to use `generateMetadata` pattern
- [x] `sitemap.ts` is either removed or converted to use `generateMetadata` pattern
- [x] `npm run build` completes with zero TypeScript errors and zero ESLint errors
- [x] `npm test` — all 8 Jest snapshot tests pass
- [x] `npm run lint` — zero ESLint errors
- [x] `npm run typecheck` — zero TypeScript errors
- [x] `npx playwright test` — all 9 E2E tests pass
- [x] All 5 pages render correctly in both light and dark modes
- [x] Dark mode styles apply correctly on all pages via system preference toggle
- [x] The mobile navigation menu opens and closes correctly on a mobile viewport width
- [x] The active navigation link is highlighted in both Header and Footer when on any page
- [x] All five pages render without runtime errors when visiting each route in a browser
- [x] The production build succeeds with zero TypeScript and zero ESLint errors
- [x] The CI workflow runs on Node 24 and passes lint and test steps
- [x] No visual changes to existing UI components — only metadata generation is changed

## Implementation Notes

### Page-Specific Titles

- `/` → "Dinesh Haribabu"
- `/about` → "About me — Dinesh Haribabu"
- `/projects` → "Projects — Dinesh Haribabu"
- `/blog` → "Blog — Dinesh Haribabu"
- `/uses` → "Uses — Dinesh Haribabu"

### robots.ts and sitemap.ts

- These can be converted to use `generateMetadata` in the root layout, or kept as separate files if Next.js 16 still supports them
- If Next.js 16 supports static `robots.ts`/`sitemap.ts` exports, they can remain as-is (the proposal says "migrate to generateMetadata" but these are special metadata files that Next.js handles differently)

### Key Constraints

- All metadata values must be preserved from the current implementation
- No new dependencies
- Must follow existing project conventions (TypeScript strict mode, path aliases)
- `generateMetadata` functions receive `props` parameter with `params` and `searchParams`

## User test

Run `npm run build` — verify zero errors and that all 5 pages produce correct metadata. Verify `robots.txt` is served correctly at `/robots.txt` and `sitemap.xml` is served correctly at `/sitemap.xml`. Run `npm test`, `npm run lint`, `npm run typecheck` — all pass. Visit each route in a browser and verify all 5 pages render correctly in both light and dark modes. Toggle system dark mode and verify styles apply correctly. On a mobile viewport width, verify the hamburger menu opens and closes. Verify the active navigation link is highlighted in both Header and Footer.

## Traceability

- **PRD**: FR-13 (all 5 pages render without runtime errors), FR-16 (dark mode), FR-14 (mobile menu), FR-15 (nav active state)
- **Proposal**: "generateMetadata migration", "Migrate all routes from static metadata exports to per-route generateMetadata functions"
- **Architecture**: §8 Cross-Cutting Concerns (metadata), §2 Folder Structure
- **UX Spec**: §1 Screen Inventory (each page's purpose and content)

## Review findings

Open — the reviewer flagged these:

- **note** `jest.config.ts:28` — Added moduleNameMapper for '^@vercel/analytics/react$' pointing to __mocks__/vercel-analytics.ts. This is a necessary addition since layout.tsx imports Analytics from @vercel/analytics/react and Jest needs the mock. The mock file (__mocks__/vercel-analytics.ts) is currently untracked and must be committed.
- **note** `src/app/layout.tsx:9` — The layout.tsx generateMetadata is synchronous (no params needed), while all 5 page generateMetadata functions are async. Both are valid Next.js patterns. The async on pages is a reasonable consistency choice even though none use params/searchParams.
- **note** `e2e/t-003-metadata.spec.ts:1` — New E2E test file is untracked. Contains 7 tests covering all 5 page titles, robots.txt, and sitemap.xml. All pass. Must be committed alongside code changes.
- **note** `src/app/__tests__/generate-metadata.test.ts:1` — New unit test file is untracked. Contains 20 tests verifying each generateMetadata function returns correct title, description, and authors. Also verifies all 5 routes have unique titles. All pass. Must be committed.
