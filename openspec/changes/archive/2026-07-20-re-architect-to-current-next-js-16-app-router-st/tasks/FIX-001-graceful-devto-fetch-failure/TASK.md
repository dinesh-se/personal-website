# FIX-001 — graceful-devto-fetch-failure

## Mission

Handle Dev.to API fetch failures gracefully on the blog page so that users see a meaningful fallback instead of an empty page when the external API is unavailable.

## Acceptance criteria

> ✅ Verified 2026-07-20

- [x] When Dev.to API fails (network error, rate limit, missing/invalid API key), the blog page still renders without console errors
- [x] The page displays a user-friendly message like 'Blog posts are temporarily unavailable. Check back soon.' instead of an empty list
- [x] The page layout is preserved (heading, intro text, and fallback message all render)
- [x] When the API succeeds, the page renders blog posts normally with no visual change

## User test

1. Set DEVTO_KEY to an invalid value in the environment. 2. Run `npm run dev` and visit http://localhost:3000/blog. 3. Verify the page shows a message like 'Blog posts are temporarily unavailable' instead of an empty list and no error appears in the terminal console. 4. Restore DEVTO_KEY to a valid value. 5. Refresh the page. 6. Verify blog posts render normally.

## Review findings

Open — the reviewer flagged these:

- **note** `e2e/fix-001-hardcoded-path-webserver.spec.ts` — No e2e test exercises the fetch failure path. The user test explicitly requires setting DEVTO_KEY to an invalid value and verifying the fallback message on /blog — this scenario is entirely untested at the integration level.

Addressed during review — raised, then fixed before the task committed:

- **critical** `src/app/blog/__tests__/BlogContent.test.tsx` — Criterion 1 ('renders without console errors') is a no-op: the test spies on console.error, renders the component, then restores the spy without any assertion about its call count. It does not verify that no console errors occurred. The actual suppression of console.error is achieved because the old inline getPageData() in page.tsx had console.error() which was removed — but this is never tested. (raised round 1)
- **critical** `src/app/blog/__tests__/BlogContent.test.tsx` — Criterion 4 ('renders blog posts normally') test only checks that post titles appear in the document — not that BlogPostCard components are rendered. The test verifies screen.getByText('First Post') but does not assert blog post cards are rendered with correct props (e.g., the card's link href, date formatting, or reaction counts). This is a weak claim of 'renders normally'. (raised round 1)
- **warning** `src/api/blog.ts` — All failure modes (network error, rate limit, invalid API key) are collapsed into a single boolean fetchFailed. There is no differentiation — if Dev.to returns 401 for an invalid API key vs 429 for rate limiting, the user sees the same message. Consider preserving the error type for future differentiation. (raised round 1)
- **warning** `src/app/blog/error.tsx` — The route-level error.tsx boundary is now dead code. Since getPageData() in src/api/blog.ts catches all errors and returns { fetchFailed: true } instead of throwing, this error boundary will never activate. It serves no purpose and may confuse future maintainers. (raised round 1)
