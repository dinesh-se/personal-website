# FIX-001 — hardcoded-path-in-playwright-webserver

## Mission

Replace the hardcoded absolute path in the Playwright webServer command with a relative path so the e2e tests can run in CI environments.

## Acceptance criteria

> ✅ Verified 2026-07-17

- [x] The webServer.command in e2e/playwright.config.ts must not contain the hardcoded path /home/dinesh-se/Dev/personal-website
- [x] The command must use a relative path (.) or process.cwd() so it works regardless of the working directory
- [x] Running npx playwright test e2e/ from the project root must still start the dev server and pass all e2e tests locally
- [x] The change must be CI-agnostic — it should work on GitHub Actions runners where the repo is checked out under /home/runner/work/...

## User test

Run: cd /home/dinesh-se/Dev/personal-website && npx playwright test e2e/home.spec.ts --reporter=line. The web server should start on port 3099 and all 12 tests should pass with no connection errors.
