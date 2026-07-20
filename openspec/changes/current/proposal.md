# Feature Brief

**Feature:** "Re-architect to current Next.js 16 App Router standards/patterns: move all Hygraph + Dev.to fetching into Server Components (App Router data model); add per-route loading.tsx + error.tsx (streaming + Suspense boundaries); adopt Cache Components (use cache / cacheLife) + Partial Prerendering for cached remote data; upgrade Next to 16.3+ as the prerequisite; migrate to generateMetadata Metadata API + typed routes; fix Experience formatDate DD/MM/YYYY bug. No visual redesign, no new pages; keep Hygraph/Dto as the data sources."

> **Correction — 2026-07-20:** Every "DD/MM/YYYY" reference below is wrong.
> Real Hygraph data is ISO 8601 (`YYYY-MM-DD`). See T-002/TASK.md's
> correction note — the original fix was verified against a fixture that
> shared the same wrong assumption, not real data, and it broke
> `formatDate()` for every real organization entry on the deployed site.

## Feature Scope

Re-architect the existing 5-page personal website to align with Next.js 16 App Router conventions without adding new pages or changing visual design. The feature covers:

- **Server Components data model**: Move all Hygraph (GraphQL) and Dev.to (REST) fetching into the App Router data model — replace inline `cache()` wrappers with proper Server Component data fetching patterns.
- **Per-route loading.tsx**: Add skeleton loader components for each route to enable streaming and Suspense boundaries.
- **Per-route error.tsx (hybrid)**: Retain the root-level `error.tsx` as a catch-all fallback, and create route-specific error pages for key routes where custom error UI adds value.
- **Cache Components**: Adopt `use cache` annotations and default `cacheLife` profiles for remote data caching, replacing the current `cache()` + `revalidate: 600` ISR pattern.
- **Partial Prerendering (PPR)**: Enable PPR alongside existing ISR to stream the static shell on first paint while allowing per-segment revalidation of cached remote data.
- **generateMetadata migration**: Migrate all routes from static `export const metadata` and standalone `robots.ts`/`sitemap.ts` to per-route `generateMetadata` functions.
- **Typed routes**: Adopt Next.js 16 typed routes pattern.
- **Experience formatDate bug fix**: `formatDate()` in `Experience.tsx` calls `new Date(date)` on DD/MM/YYYY strings (e.g. `"31/01/2024"`) which JavaScript cannot parse, producing `"Invalid Date"`. Fix the parser to correctly handle DD/MM/YYYY input and display as MMM YYYY — no visual change to the output format.

**Out of scope:** No visual redesign, no new pages, no new data sources, no changes to component UI (Header, Footer, BlogPostCard, ProjectCard, etc.).

## Acceptance Criteria

- [ ] All 5 pages (`/`, `/about`, `/projects`, `/blog`, `/uses`) fetch data using Server Component patterns (no client-side data fetching).
- [ ] Each route has a `loading.tsx` with skeleton loaders that match the page layout.
- [ ] Root-level `error.tsx` exists as catch-all; route-specific `error.tsx` files exist for key routes (hybrid pattern).
- [ ] `use cache` annotations and `cacheLife` profiles replace `cache()` + `revalidate: 600` for remote data.
- [ ] Partial Prerendering is enabled (`experimental_ppr: 'incremental'` in next.config) and static shell streams on first paint.
- [ ] All routes use `generateMetadata` instead of static `export const metadata` or standalone `robots.ts`/`sitemap.ts`.
- [ ] Next.js upgraded to 16.3+ and build succeeds without errors.
- [ ] No visual changes — existing UI components render identically.
- [ ] Existing tests (Jest snapshot tests for 8 components) continue to pass.
- [ ] Experience component `formatDate()` correctly parses DD/MM/YYYY input (e.g. `"31/01/2024"`) and renders as `"Jan 2024"` — no `"Invalid Date"` strings.
- [ ] Experience component displayed date format unchanged (MMM YYYY).

## Affected Areas

- **`src/app/`** — All 5 page routes: `page.tsx` (data fetching migration), `loading.tsx` (new), `error.tsx` (new/updated), `layout.tsx` (metadata migration)
- **`src/app/robots.ts`** — Migrated to generateMetadata or removed
- **`src/app/sitemap.ts`** — Migrated to generateMetadata or removed
- **`src/api/graphql.ts`** — May need updates for Cache Components compatibility
- **`src/api/rest.ts`** — May need updates for Cache Components compatibility
- **`src/components/Experience/Experience.tsx`** — `formatDate()` parsing logic fix (DD/MM/YYYY → correct Date → MMM YYYY display)
- **`next.config.mjs`** — PPR experimental flag, any Cache Components config
- **`package.json`** — Next.js version bump to 16.3+

## Data Needs

None — uses existing integrations (Hygraph GraphQL API + Dev.to REST API). No new external data sources required.

## Integration Concerns

- **Hygraph GraphQL** (`src/api/graphql.ts`): Data fetching layer must be compatible with Cache Components — ensure `cache()` annotations from React are used correctly and that GraphQL queries return cacheable data. The Hygraph endpoint and auth pattern remain unchanged.
- **Dev.to REST** (`src/api/rest.ts`): Same as Hygraph — REST fetching must work within Server Component data model and be compatible with Cache Components.
- **@graphcms/rich-text-react-renderer**: Used on `/about` page — must remain compatible with React 19 (part of the broader Next.js 16 upgrade).
- **react-social-icons**: Dependency present — verify React 19 compatibility.
- **Vercel Analytics**: `<Analytics />` in layout — must remain compatible with React 19 and Next.js 16.
- **Tailwind CSS**: Existing v3.4.12 — verify compatibility with Next.js 16 build pipeline.

## Risks

- **React 19 compatibility with existing libraries** — `@graphcms/rich-text-react-renderer` and `react-social-icons` may have incompatibilities. Mitigation: verify during upgrade; pin to React 18-compatible versions if needed.
- **Cache Components + existing `cache()` usage** — The current `cache()` wrapper pattern from React needs to be replaced with `use cache` annotations. Mitigation: systematic migration per route, leveraging the `cache-components-instant-false` codemod.
- **Partial Prerendering experimental status** — PPR in Next.js 16 may have edge cases with ISR. Mitigation: test thoroughly with each route's data fetching pattern; fall back to ISR-only if PPR causes issues.
- **generateMetadata breaking changes** — Migrating from static exports to dynamic `generateMetadata` may affect build-time metadata generation. Mitigation: port existing metadata values verbatim; test build output.
- **Typed routes API stability** — Next.js 16 typed routes may evolve. Mitigation: follow official migration guide; defer if API changes before implementation.

## Open Questions

- None — all boundaries resolved during feature brief.

## Next Steps

Write the feature brief to /home/dinesh-se/Dev/personal-website/openspec/changes/current/proposal.md, then call confirm_step_output.
