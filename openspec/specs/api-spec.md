# API Spec

## 1. Base URL & Versioning

This is a **static site with no internal API**. All APIs are external:

- **Hygraph GraphQL:** `https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/{adminId}/master`
  - Version: v2 (Hygraph GraphQL API version)
  - Environment: master branch, PUBLISHED stage
- **Dev.to REST:** `https://dev.to/api`
  - Version: Not versioned (standard Dev.to API)

**Feature impact (single-page homepage redesign):** No change to base URLs or versioning. The redesign consolidates the Hygraph queries but does not alter endpoint contracts.

## 2. Authentication

### Hygraph (GraphQL)

- **Method:** Bearer token in Authorization header
- **Configured in:** `src/api/graphql.ts`
- **Env var:** `HYGRAPH_AUTH_TOKEN`
- **Headers:** `{ authorization: `Bearer ${proc...KEN}` }`
  - The `Bearer ` scheme is required (verified live: Bearer → 200).
- **Timeout:** `AbortSignal.timeout(10_000)` applied per request

### Dev.to (REST)

- **Method:** API key in custom header
- **Configured in:** `src/api/rest.ts`
- **Env var:** `DEVTO_KEY`
- **Headers:** `{ 'api-key': process.env.DEVTO_KEY || '' }`

**Feature impact (single-page homepage redesign):** No change to auth mechanisms, env var handling, or credential exposure.

## 3. Endpoints

### Hygraph GraphQL (`src/api/graphql.ts`)

All queries target the same endpoint with different GraphQL operations.

#### Query: ProfileData (getProfile)

- **HTTP Method:** POST
- **Path:** `/v2/{adminId}/master`
- **Auth:** Bearer token required
- **Variables:** `{ id: process.env.HYGRAPH_USER_ID }`
- **Fields requested:**
  - `profile.fullName`
  - `profile.summary`
  - `profile.interests`
  - `profile.moreDetails.raw` (RichTextContent)
  - `profile.displayPicture.url`
  - `profile.contactDetail.email, mobileNumber, socialMedia.linkedin, socialMedia.github`
- **Response shape:** `Author` type (wraps `profile` object)
- **Used by:** `src/app/page.tsx` (Home) — the sole data-fetching query for the single-page homepage
- **Error handling:** Returns `{ success: false, errorType }` on failure (never throws); the page renders graceful fallback

> **Consolidation:** The former `getUser`, `getMoreDetails`, and `getUses` queries (and `GET_USES` operation) were removed and folded into this single `getProfile` query when the multi-page site collapsed into a single-page homepage.

### Dev.to REST (`src/api/rest.ts`)

#### GET /api/articles/me/published

- **HTTP Method:** GET
- **Path:** `/api/articles/me/published`
- **Auth:** api-key header required
- **Response shape:** `BlogPost[]` array
- **Transformation:** Mapped to `BlogPostUI[]` (date formatting, field renaming)
- **Error handling:** Classified into `network | rate_limit | auth | server | unknown` via `getBlogFetchResult`; never throws
- **Timeout:** `AbortSignal.timeout(10_000)` applied per request
- **Caching:** Resolved through `getCachedBlogResult` / `getBlogFeed` (`use cache` + `cacheLife('hours')`), so the upstream Dev.to fetch is shared across visitors instead of repeated per request. The route handler returns `{ success, total, posts }`; the home page's Writing section uses the same cached feed.
- **Used by:** `src/app/api/articles/me/published/route.ts` (route handler), `src/app/page.tsx` (Home "Latest from the blog")

## 4. Common Error Format

Both fetch layers classify failures into a shared taxonomy so server components can render graceful fallbacks (never crash the page):

- **REST (Dev.to, `src/api/rest.ts`):** `getBlogFetchResult` returns `{ success: false, errorType }` with `errorType ∈ network | rate_limit | auth | server | unknown`. Never throws.
- **GraphQL (Hygraph, `src/api/graphql.ts`):** `getProfile` returns `{ success: false, errorType }` via `classifyHygraphError` (`network | rate_limit | auth | server | malformed | unknown`). Never throws.
- **Timeouts:** Both layers apply `AbortSignal.timeout(10_000)`; a timeout classifies as `network`.
- **Graceful fallback:** The single-page homepage renders empty/fallback content on failure rather than propagating to the error boundary.

## 5. Rate Limits

**Not documented in code.** Rate limits are imposed by:

- **Hygraph:** Based on plan tier (not specified in code)
- **Dev.to:** API rate limits documented at <https://developers.dev.to> (not specified in code)

No retry logic, caching headers, or rate limit handling implemented.
