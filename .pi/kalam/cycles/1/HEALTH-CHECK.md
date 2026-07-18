# App Health Check — 2026-07-18 22:39

**Status:** HEALTHY (23 advisory notices)

| Metric | Value |
|---|---|
| Check cycles completed | 14 |
| Open issues | 23 (23 advisory) |
| Pending feedback items | 0 |
| Authored e2e specs | 9 |
| Scenario coverage | 0/10 PRD scenarios covered by done tasks |
| Last check | 2026-07-18 22:25 |

## Open Issues

| ID | Kind | Source | Fix Task | Status |
|---|---|---|---|---|
| ISS-048 | budget-violation | advisory: LCP 54805ms exceeds budget 2500ms | — | Open |
| ISS-049 | budget-violation | advisory: CLS 0.123 exceeds budget 0.1 | — | Open |
| ISS-050 | budget-violation | advisory: TBT 1287ms exceeds budget 300ms | — | Open |
| ISS-051 | budget-violation | advisory: Performance score 0.26 is below budget 0.9 | — | Open |
| ISS-052 | budget-violation | advisory: LCP 54844ms exceeds budget 2500ms | — | Open |
| ISS-053 | budget-violation | advisory: TBT 1108ms exceeds budget 300ms | — | Open |
| ISS-054 | budget-violation | advisory: Performance score 0.28 is below budget 0.9 | — | Open |
| ISS-055 | budget-violation | advisory: LCP 54814ms exceeds budget 2500ms | — | Open |
| ISS-056 | budget-violation | advisory: TBT 1084ms exceeds budget 300ms | — | Open |
| ISS-082 | budget-violation | advisory: LCP 54763ms exceeds budget 2500ms | — | Open |
| ISS-083 | budget-violation | advisory: TBT 1251ms exceeds budget 300ms | — | Open |
| ISS-084 | budget-violation | advisory: Performance score 0.29 is below budget 0.9 | — | Open |
| ISS-085 | budget-violation | advisory: LCP 54816ms exceeds budget 2500ms | — | Open |
| ISS-086 | budget-violation | advisory: TBT 1150ms exceeds budget 300ms | — | Open |
| ISS-087 | budget-violation | advisory: Performance score 0.30 is below budget 0.9 | — | Open |
| ISS-088 | budget-violation | advisory: TBT 1165ms exceeds budget 300ms | — | Open |
| ISS-090 | budget-violation | advisory: LCP 2856ms exceeds budget 2500ms | — | Open |
| ISS-091 | budget-violation | advisory: TBT 1225ms exceeds budget 300ms | — | Open |
| ISS-092 | budget-violation | advisory: Performance score 0.72 is below budget 0.9 | — | Open |
| ISS-094 | budget-violation | advisory: LCP 2855ms exceeds budget 2500ms | — | Open |
| ISS-095 | budget-violation | advisory: TBT 1175ms exceeds budget 300ms | — | Open |
| ISS-096 | budget-violation | advisory: LCP 2854ms exceeds budget 2500ms | — | Open |
| ISS-097 | budget-violation | advisory: TBT 1178ms exceeds budget 300ms | — | Open |

## Feedback Backlog

| ID | Submitted | Description | Category | Fix Task | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Open Reviewer Findings

### T-001 (3 open)

- [note] package.json — The --webpack flag in build/dev scripts is redundant in Next.js 16 where webpack is the default bundler, but it is not deprecated and does not cause issues.
- [note] next.config.mjs — reactStrictMode is set to true. This option is still supported in Next.js 16 but has been a no-op for several versions. Not a breaking change, but worth noting.
- [note] .pi/kalam/dashboard.html — This file is part of the kalam pipeline dashboard (status tracking), not the Next.js application. Its changes in the diff are unrelated to the dependency upgrade task but were included in the working tree.

### T-002 (5 open)

- [warning] package.json — eslint-plugin-jsx-a11y (^6.10.0) was removed from devDependencies. The task explicitly states 'Do NOT remove deprecated dependencies unless they become incompatible.' The plugin was unused in eslint.config.mjs (which only uses @next/eslint-plugin-next and @typescript-eslint/eslint-plugin), so it was dead weight, but removing it without explicit approval violates the 'Do NOT' instruction.
- [note] package.json — eslint constraint is ^9.39.0 but latest stable is 10.7.0. This is within the 9.x line and may be intentional given the 'Do NOT change ESLint configuration' constraint, but it doesn't match 'latest stable' literally.
- [note] package.json — typescript constraint is ^5.0.0 but latest stable is 7.0.2. A major version upgrade would require significant code/config changes, so staying on 5.x is pragmatic but doesn't match 'latest stable' literally.
- [note] package.json — typecheck script (tsc --noEmit) was added to package.json as a new script. This is not a dependency change but a new addition to the scripts section.
- [note] package.json — Multiple major version bumps in dev/test tools: jest 29→30, babel-jest 29→30, @types/jest 29→30, @types/node 22→26, @trivago/prettier-plugin-sort-imports 4→6, eslint-config-prettier 9→10. All working correctly but these are significant version jumps.

### T-003 (4 open)

- [note] src/app/about/page.tsx — Catch block returns richContent: [] as fallback. This is type-safe (never[] is assignable to RichTextContent = Array<ElementNode> | { children: ... }), but the RichText component will render nothing at runtime. This is acceptable for a fallback but worth noting.
- [note] src/app/blog/page.tsx — Catch block returns [] (never[]) for BlogPostUI[]. Type-safe via never[] assignability, but the page will render empty content (no posts) when the Dev.to API fails. Acceptable for a fallback.
- [note] src/app/uses/page.tsx — Catch block returns [] (never[]) for UsesType[]. Same pattern as blog/page.tsx — type-safe but renders empty content on API failure.
- [note] diff overview — The task description says 'Fix all resulting TypeScript compilation errors' but the actual changes only add try-catch blocks around data fetching. No specific TypeScript errors were fixed — the dependency upgrades (T-002) did not introduce any TypeScript compilation errors. The task is essentially error-handling additions rather than TypeScript error fixes. All acceptance criteria are still met because the build was already clean.

### T-004 (3 open)

- [note] eslint.config.mjs — arrow-body-style and prefer-arrow-callback are explicitly set to 'off' but are already ESLint core defaults (off). eslint-config-prettier does not include these rules. These are redundant no-ops, not harmful but unnecessary.
- [note] eslint.config.mjs — Extra ignore patterns 'out/' and '.out/' added beyond the original .eslintrc.json ignorePatterns (which only had 'e2e/'). Not a bug, just scope creep on ignores.
- [note] eslint.config.mjs — TypeScript parser is configured in both the Next.js config block and in tsPlugin.configs['flat/recommended'][0]. Flat config merges languageOptions across matching configs, so the last parser wins — both use the same tsParser, so this is harmless but redundant.

### T-005 (3 open)

- [note] eslint.config.mjs — arrow-body-style and prefer-arrow-callback are explicitly set to 'off' but are already ESLint core defaults. These are redundant no-ops — harmless but unnecessary.
- [note] eslint.config.mjs — Extra ignore patterns 'out/' and '.out/' added beyond the original .eslintrc.json ignorePatterns (which only had 'e2e/'). Not a bug, just scope creep on ignores.
- [note] eslint.config.mjs — TypeScript parser is configured in both the Next.js config block and in tsPlugin.configs['flat/recommended'][0]. Flat config merges languageOptions, so both use the same tsParser — harmless but redundant.

### T-006 (1 open)

- [note] .github/workflows/lint-test.yml:1 — No `engines` field in package.json to pin the required Node version — the CI and local environments both use Node 24, but there's no manifest-level constraint. Consider adding `"engines": {"node": ">=24"}` to prevent future drift.

### T-007 (2 open)

- [warning] src/components/Experience/Experience.tsx:7 — The Experience component renders 'Invalid Date' for date values in DD/MM/YYYY format (e.g., '31/01/2024'). The formatDate function uses new Date(date) which does not parse non-ISO date strings. The snapshot faithfully captures this broken output. While the task says not to change components, this is a visible rendering bug the snapshot now confirms.
- [note] src/app/about/page.tsx:1 — The /about page uses @graphcms/rich-text-react-renderer but there is no test covering it. The acceptance criteria mentions verifying this renders correctly, yet no About page snapshot test exists. The 8 component tests listed in the user test do not include the About page.

### T-008 (1 open)

- [warning] e2e/home.spec.ts:74 — The dark mode test only checks for 'antialiased' on the body element, which is always present regardless of dark mode state. It does not actually test dark mode behavior (e.g., toggling dark mode class or verifying dark CSS variables apply). The test passes but doesn't verify what it claims to test.