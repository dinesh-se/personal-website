# T-006 — Update CI Workflow to Node 24

**Milestone:** 2 — Tooling Migration

## Mission

Update the GitHub Actions CI workflow (`.github/workflows/lint-test.yml`) to use Node 24 instead of Node 18, bump `setup-node` action from v2 to v4 (required for Node 24 support), and verify the workflow syntax is valid and runs successfully. This is a vertical slice: update CI config, validate syntax, and verify the workflow executes correctly. This aligns the CI environment with the local development environment, ensuring parity between local and CI testing.

## Covers features

- Update CI workflow to Node 24

## Covers scenarios

- **US-1: As a developer, I want the CI pipeline to use the same Node version as my local environment so that I can trust CI results reflect local development.**
  - WHEN I open a pull request, THEN the CI job runs on Node 24 (matching my local dev environment).
  - WHEN CI passes, THEN I can be confident the code works on the same runtime I use locally.

## Dependencies

- **Task:** T-005 (lint must pass before CI workflow is updated, to ensure the workflow changes don't introduce new errors)

## Acceptance criteria

> ✅ Verified 2026-07-17

- [x] `.github/workflows/lint-test.yml` uses `node-version: '24'` (or `node-version: 24`)
- [x] `setup-node` action is bumped to `v4` (from `v2`)
- [x] All CI steps (`npm ci`, `npm run lint`, `npm test`) reference the updated Node version
- [x] Workflow syntax is valid and can be validated with GitHub's workflow validator
- [x] Tests: No new CI errors introduced (workflow is syntactically correct)
- [x] `npm run typecheck` and `npm test` pass

## User test

1. Open a PR to `main` — verify CI job runs on Node 24
2. Verify CI passes all steps (lint, test)
3. Check the CI logs to confirm Node 24 is being used

## Files likely touched

- `.github/workflows/lint-test.yml`

## Do NOT

- Change the CI workflow steps (only update Node version and setup-node action)
- Add new CI jobs or stages
- Modify the lint or test commands themselves

## Review findings

Open — the reviewer flagged these:

- **note** `.github/workflows/lint-test.yml:1` — No `engines` field in package.json to pin the required Node version — the CI and local environments both use Node 24, but there's no manifest-level constraint. Consider adding `"engines": {"node": ">=24"}` to prevent future drift.
