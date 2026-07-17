# T-007 — Fix Jest Snapshot Tests

**Milestone:** 3 — Test Verification

## Mission

Fix all Jest snapshot test failures introduced by the dependency upgrades and verify all 8 component tests pass. React 19 and upgraded libraries may change the rendered output of components, causing snapshot mismatches. Update the snapshots to reflect the new expected output while verifying that the functional behavior of each component is preserved. This is a vertical slice: fix snapshots across all components and verify the full test suite passes.

## Covers features

- All Jest snapshot tests pass

## Covers scenarios

- None (this is a test maintenance task; behavioral verification is covered in later tasks)

## Dependencies

- **Task:** T-003 (TypeScript errors must be fixed first to ensure tests can run)

## Acceptance criteria

- [ ] All 8 component snapshot tests pass with zero failures
- [ ] Snapshots are updated to reflect React 19 output (if changed)
- [ ] `@graphcms/rich-text-react-renderer` renders correctly on `/about` page snapshot
- [ ] `react-social-icons` renders correctly in Contact component snapshot
- [ ] All 8 component snapshot tests pass with zero failures
- [ ] Snapshots are updated to reflect React 19 output (if changed)
- [ ] `@graphcms/rich-text-react-renderer` renders correctly on `/about` page snapshot
- [ ] `react-social-icons` renders correctly in Contact component snapshot
- [ ] `npm test` exits with code 0
- [ ] Tests: `npm test` — all 8 suites pass, all snapshots match
- [ ] `npm run typecheck` and `npm run lint` pass

## User test

1. Run `npm test` — verify all 8 component snapshot tests pass
2. Verify the following components have passing snapshots:
   - Header
   - Footer
   - NavLinks
   - Contact
   - Experience
   - BlogPostCard
   - ProjectCard
   - RecentProjects

## Files likely touched

- `src/components/Header/__snapshots__/`
- `src/components/Footer/__snapshots__/`
- `src/components/NavLinks/__snapshots__/`
- `src/components/Contact/__snapshots__/`
- `src/components/Experience/__snapshots__/`
- `src/components/BlogPostCard/__snapshots__/`
- `src/components/ProjectCard/__snapshots__/`
- `src/components/RecentProjects/__snapshots__/`
- `jest.config.ts` (if config changes are needed for React 19)
- `jest.setup.ts` (if setup changes are needed)
- `babel.config.json` (if babel config changes are needed)

## Do NOT

- Remove any component tests
- Change the components themselves (only update snapshots)
- Add new tests (new tests are covered in T-008 for E2E)
