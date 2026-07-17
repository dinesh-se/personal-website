# T-005 — Fix All Resulting ESLint Errors

**Milestone:** 2 — Tooling Migration

## Mission

Fix all remaining ESLint errors introduced by the flat config migration and/or dependency upgrades and verify lint passes with zero errors. This is a vertical slice: fix lint errors across all source files and verify the entire codebase lints cleanly. Includes errors from changed rule semantics in ESLint 9, updated TypeScript-eslint rules, or new warnings from upgraded linting plugins.

## Covers features

- Fix all resulting ESLint errors

## Covers scenarios

- None (this is a fix-up task; behavioral verification is covered in later tasks)

## Dependencies

- **Task:** T-004 (ESLint flat config must be in place before errors can be accurately identified and fixed)

## Acceptance criteria

- [ ] `npm run lint` exits with code 0
- [ ] Lint output contains zero errors
- [ ] All source files in `src/` pass linting with zero errors
- [ ] All test files in `src/components/*/` pass linting with zero errors
- [ ] All E2E test files in `e2e/` are properly ignored
- [ ] `npm run lint` exits with code 0
- [ ] Tests: `npm run lint` passes with zero warnings/errors
- [ ] `npm run typecheck` and `npm test` pass

## User test

1. Run `npm run lint` — verify zero ESLint errors
2. Run `npm run format` — verify Prettier formatting is consistent
3. Run `npm test` — verify tests still pass

## Files likely touched

- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/uses/page.tsx`
- `src/components/*/` (any component with lint errors)
- `eslint.config.js` (if rule adjustments are needed)

## Do NOT

- Change application logic or component behavior
- Add new features or pages
- Modify external API integrations
