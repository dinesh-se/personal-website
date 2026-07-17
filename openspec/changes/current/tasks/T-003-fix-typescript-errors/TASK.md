# T-003 — Fix All Resulting TypeScript Errors

**Milestone:** 1 — Core Dependency Upgrade

## Mission

Fix all remaining TypeScript compilation errors introduced by the dependency upgrades and verify the build succeeds with zero TypeScript errors. This is a vertical slice: fix compilation errors across all layers and verify the entire app builds and renders. Includes errors from React 19 PropTypes removal, new hooks, context API changes, Next.js 16 App Router changes, and any type incompatibilities in third-party libraries.

## Covers features

- Fix all resulting TypeScript errors

## Covers scenarios

- None (this is a fix-up task; behavioral verification is covered in later tasks)

## Dependencies

- **Task:** T-002 (all dependencies must be upgraded before TypeScript errors can be accurately identified and fixed)

## Acceptance criteria

- [ ] `npm run build` exits with code 0
- [ ] Build output contains zero TypeScript compilation errors
- [ ] All 5 pages (`/`, `/about`, `/projects`, `/blog`, `/uses`) compile without type errors
- [ ] All components in `src/components/` compile without type errors
- [ ] All API modules in `src/api/` compile without type errors
- [ ] All type definitions in `src/types/` are compatible with upgraded packages
- [ ] Tests: `npm test` runs without TypeScript errors in test files
- [ ] `npm run typecheck` and `npm run lint` pass

## User test

1. Run `npm run build` — verify zero TypeScript errors in output
2. Run `npm test` — verify all 8 test suites execute without TypeScript errors
3. Run `npm run dev` — then visit `/`, `/about`, `/projects`, `/blog`, `/uses` — verify each page loads without errors

## Files likely touched

- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/uses/page.tsx`
- `src/app/layout.tsx`
- `src/components/Header/Header.tsx`
- `src/components/Footer/Footer.tsx`
- `src/components/NavLinks/NavLinks.tsx`
- `src/components/Contact/Contact.tsx`
- `src/components/Experience/Experience.tsx`
- `src/components/BlogPostCard/BlogPostCard.tsx`
- `src/components/ProjectCard/ProjectCard.tsx`
- `src/components/RecentProjects/RecentProjects.tsx`
- `src/api/graphql.ts`
- `src/api/rest.ts`
- `src/types/*.ts`
- `tsconfig.json` (if React 19 types require config changes)

## Do NOT

- Add new features or pages
- Change visual design or styling
- Modify external API integrations (Hygraph, Dev.to)
- Rewrite application logic or data fetching patterns
