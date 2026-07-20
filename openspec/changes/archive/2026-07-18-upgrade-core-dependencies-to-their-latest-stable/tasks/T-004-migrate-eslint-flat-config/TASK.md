# T-004 — Migrate ESLint v8 (.eslintrc.json) to v9 Flat Config

**Milestone:** 2 — Tooling Migration

## Mission

Migrate ESLint from v8 (legacy `.eslintrc.json`) to v9 with the new flat config format (`eslint.config.js` or `eslint.config.mjs`), fix all resulting lint errors, and verify lint passes with zero errors. This is a vertical slice: migrate config, fix all lint errors in source files, and verify the entire codebase lints cleanly. Re-map all existing rules and plugins from the legacy config to the flat config format. The existing rules from `.eslintrc.json` (extends: `next/core-web-vitals`, `plugin:@typescript-eslint/recommended`, `plugin:prettier/recommended`; plugins: `@typescript-eslint`, `jsx-a11y`) must be preserved in the new format.

## Covers features

- Migrate ESLint v8 to v9 flat config

## Covers scenarios

- None (this is a configuration migration; behavioral verification is covered in later tasks)

## Dependencies

- **Task:** T-003 (TypeScript errors must be fixed first to ensure ESLint can run without TS-related noise)

## Acceptance criteria

> ✅ Verified 2026-07-17

- [x] `eslint.config.js` (or `eslint.config.mjs`) exists at project root
- [x] `.eslintrc.json` is removed
- [x] `package.json` `lint` script points to `next lint` (or `eslint` directly)
- [x] All existing rules are preserved in flat config:
  - `next/core-web-vitals` rules
  - `@typescript-eslint/recommended` rules
  - `prettier/recommended` rules
  - `jsx-a11y` rules
- [x] `eslint.config.js` ignores `e2e/`, `.next/`, and `node_modules/`
- [x] All source files in `src/` pass linting with zero errors
- [x] `npm run lint` executes with zero errors
- [x] Tests: `npm run lint` passes with zero warnings/errors
- [x] `npm run typecheck` and `npm test` pass

## User test

1. Run `npm run lint` — verify ESLint v9 runs using flat config with zero errors
2. Run `npm run format` — verify Prettier continues to work without errors
3. Verify `.eslintrc.json` no longer exists and `eslint.config.js` exists

## Files likely touched

- `eslint.config.js` (new file)
- `.eslintrc.json` (removed)
- `package.json` (update `lint` script if needed)
- `.eslintrc.json` ignore patterns must be preserved in flat config

## Do NOT

- Change the linting rules themselves (only migrate the config format)
- Add new linting rules or plugins
- Remove existing rules unless they are deprecated in ESLint 9

## Review findings

Open — the reviewer flagged these:

- **note** `eslint.config.mjs` — arrow-body-style and prefer-arrow-callback are explicitly set to 'off' but are already ESLint core defaults (off). eslint-config-prettier does not include these rules. These are redundant no-ops, not harmful but unnecessary.
- **note** `eslint.config.mjs` — Extra ignore patterns 'out/' and '.out/' added beyond the original .eslintrc.json ignorePatterns (which only had 'e2e/'). Not a bug, just scope creep on ignores.
- **note** `eslint.config.mjs` — TypeScript parser is configured in both the Next.js config block and in tsPlugin.configs['flat/recommended'][0]. Flat config merges languageOptions across matching configs, so the last parser wins — both use the same tsParser, so this is harmless but redundant.
