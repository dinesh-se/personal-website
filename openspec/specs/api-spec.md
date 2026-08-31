# API Spec

## 1. Base URL & Versioning

This is a **static site with no internal API**. All APIs are external:

- **Hygraph GraphQL:** `https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/{adminId}/master`
  - Version: v2 (Hygraph GraphQL API version)
  - Environment: master branch, PUBLISHED stage
- **Dev.to REST:** `https://dev.to/api`
  - Version: Not versioned (standard Dev.to API)

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The feature does not modify external API integrations, versioning strategy, or endpoint contracts.

## 2. Authentication

### Hygraph (GraphQL)

- **Method:** Bearer token in Authorization header
- **Configured in:** `src/api/graphql.ts`
- **Env var:** `HYGRAPH_AUTH_TOKEN`
- **Headers:** `{ authorization: Bearer ${process.env.HYGRAPH_AUTH_TOKEN} }`
  - The `Bearer ` scheme is required (verified live: Bearer → 200).
- **Timeout:** `AbortSignal.timeout(10_000)` applied per request

### Dev.to (REST)

- **Method:** API key in custom header
- **Configured in:** `src/api/rest.ts`
- **Env var:** `DEVTO_KEY`
- **Headers:** `{ 'api-key': process.env.DEVTO_KEY || '' }`

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The feature does not modify auth mechanisms, env var handling, or expose any credentials to the client.

## 3. Endpoints

### Hygraph GraphQL (`src/api/graphql.ts`)

All queries target the same endpoint with different GraphQL operations.

#### Query: UserData (getUser)

- **HTTP Method:** POST
- **Path:** `/v2/{adminId}/master`
- **Auth:** Bearer token required
- **Variables:** `{ id: process.env.HYGRAPH_USER_ID }`
- **Fields requested:**
  - `profile.summary`
  - `profile.contactDetail.email, mobileNumber, socialMedia.linkedin, socialMedia.github`
  - `profile.experience.organizations.orgName, title, from, to, orgLogo.url`
- **Response shape:** `Author` type (wraps `profile` object)
- **Used by:** `src/app/page.tsx` (Home) — the GitHub `githubRecentProjects` field was removed with the Projects page
- **Error handling:** Returns `{ success: false, errorType }` on failure (never throws); page renders graceful fallback

#### Query: ProfileUsers (getMoreDetails)

- **HTTP Method:** POST
- **Path:** `/v2/{adminId}/master`
- **Auth:** Bearer token required
- **Variables:** `{ id: process.env.HYGRAPH_USER_ID }`
- **Fields requested:**
  - `profile.displayPicture.url`
  - `profile.moreDetails.raw` (RichTextContent)
  - `profile.contactDetail.email, mobileNumber, socialMedia.linkedin, socialMedia.github`
- **Response shape:** `Author` type
- **Used by:** `src/app/about/page.tsx` (About)

#### Query: ProfileUsers (getUses)

- **HTTP Method:** POST
- **Path:** `/v2/{adminId}/master`
- **Auth:** Bearer token required
- **Variables:** `{ id: process.env.HYGRAPH_USER_ID }`
- **Fields requested:**
  - `profile.uses.id, title, list.id, list.name, list.description`
- **Response shape:** `Author` type (extracts `profile.uses` array)
- **Used by:** `src/app/uses/page.tsx` (Uses)

### Dev.to REST (`src/api/rest.ts`)

#### GET /api/articles/me/published

- **HTTP Method:** GET
- **Path:** `/api/articles/me/published`
- **Auth:** api-key header required
- **Response shape:** `BlogPost[]` array
- **Transformation:** Mapped to `BlogPostUI[]` (date formatting, field renaming)
- **Error handling:** Classified into `network | rate_limit | auth | server | unknown` via `getBlogFetchResult`; never throws
- **Timeout:** `AbortSignal.timeout(10_000)` applied per request
- **Caching:** Resolved through `getCachedBlogResult` / `getBlogFeed` (`use cache` + `cacheLife('hours')`), so the upstream Dev.to fetch is shared across visitors instead of repeated per request. The route handler returns `{ success, total, posts }`; the blog page and home strip use the same cached feed.
- **Used by:** `src/app/api/articles/me/published/route.ts` (route handler), `src/app/blog/page.tsx` (Blog), `src/app/page.tsx` (Home "Latest from the blog")

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The feature explicitly excludes changing external API integrations. No new endpoints are added. Existing endpoints remain functionally identical; the `graphql-request` library version is not bumped for this feature.

## 4. Common Error Format

Both fetch layers classify failures into a shared taxonomy so server components can render graceful fallbacks (never crash the page):

- **REST (Dev.to, `src/api/rest.ts`):** `getBlogFetchResult` returns `{ success: false, errorType }` with `errorType ∈ network | rate_limit | auth | server | unknown`. Never throws.
- **GraphQL (Hygraph, `src/api/graphql.ts`):** `getUser` / `getMoreDetails` / `getUses` return `{ success: false, errorType }` via `classifyHygraphError` (`network | rate_limit | auth | server | malformed | unknown`). Never throws.
- **Timeouts:** Both layers apply `AbortSignal.timeout(10_000)`; a timeout classifies as `network`.
- **Graceful fallback:** Pages (Home, About, Uses) and the blog strip render empty/fallback content on failure rather than propagating to the error boundary.

## 5. Rate Limits

**Not documented in code.** Rate limits are imposed by:

- **Hygraph:** Based on plan tier (not specified in code)
- **Dev.to:** API rate limits documented at <https://developers.dev.to> (not specified in code)

No retry logic, caching headers, or rate limit handling implemented.

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The feature does not introduce new rate-limited endpoints or modify rate limit behavior.
