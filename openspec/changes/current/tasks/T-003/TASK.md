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

- [ ] Root `layout.tsx` uses `generateMetadata` instead of static `export const metadata`
- [ ] All 5 routes (`/`, `/about`, `/projects`, `/blog`, `/uses`) have `generateMetadata` functions
- [ ] Each route's metadata includes a page-specific title (e.g., "About me — Dinesh Haribabu") and description
- [ ] `robots.ts` is either removed or converted to use `generateMetadata` pattern
- [ ] `sitemap.ts` is either removed or converted to use `generateMetadata` pattern
- [ ] `npm run build` completes with zero TypeScript errors and zero ESLint errors
- [ ] `npm test` — all 8 Jest snapshot tests pass
- [ ] `npm run lint` — zero ESLint errors
- [ ] `npm run typecheck` — zero TypeScript errors
- [ ] `npx playwright test` — all 9 E2E tests pass
- [ ] All 5 pages render correctly in both light and dark modes
- [ ] Dark mode styles apply correctly on all pages via system preference toggle
- [ ] The mobile navigation menu opens and closes correctly on a mobile viewport width
- [ ] The active navigation link is highlighted in both Header and Footer when on any page
- [ ] All five pages render without runtime errors when visiting each route in a browser
- [ ] The production build succeeds with zero TypeScript and zero ESLint errors
- [ ] The CI workflow runs on Node 24 and passes lint and test steps
- [ ] No visual changes to existing UI components — only metadata generation is changed

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
