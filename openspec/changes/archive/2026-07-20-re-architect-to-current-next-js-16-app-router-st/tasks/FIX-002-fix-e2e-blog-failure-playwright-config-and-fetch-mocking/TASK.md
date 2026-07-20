# FIX-002 — fix-e2e-blog-failure-playwright-config-and-fetch-mocking

## Mission

Make the FIX-001 e2e spec pass by starting the Next.js dev server in Playwright and enabling the test to mock the Dev.to API response via browser-side interception.

## Acceptance criteria

> ✅ Verified 2026-07-20

- [x] Playwright config starts the Next.js dev server on port 3099 before running e2e tests (via webServer config)
- [x] A local API route exists at /api/articles/me/published that wraps the Dev.to fetch (reuses existing getBlogFetchResult logic from src/api/rest.ts)
- [x] BlogContent component is converted to a client component ('use client') that fetches from the local API route instead of receiving pre-fetched data from a server component
- [x] The blog page.tsx becomes a thin server wrapper that renders BlogContent (now a client component)
- [x] The e2e test's page.route('**/api/articles/me/published*') successfully intercepts the browser request and mocks the Dev.to response
- [x] Both e2e spec tests pass: the auth-failure fallback path and the success path with mocked posts

## User test

1. Run `npx playwright test e2e/fix-001-graceful-devto-fetch-failure.spec.ts` — both tests should pass without ERR_CONNECTION_REFUSED.
2. Visit http://localhost:3099/blog in a browser — Dev.to posts should render normally.
3. Set DEVTO_KEY to an invalid value, restart the dev server, and visit /blog — the fallback message 'Blog posts are temporarily unavailable. Check back soon.' should appear.
