# API Spec

## 1. Base URL & Versioning

This is a **static site with no internal API**. All APIs are external:

- **Hygraph GraphQL:** `https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/{adminId}/master`
  - Version: v2 (Hygraph GraphQL API version)
  - Environment: master branch, PUBLISHED stage
- **Dev.to REST:** `https://dev.to/api`
  - Version: Not versioned (standard Dev.to API)

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The upgrade does not modify external API integrations or versioning strategy.

## 2. Authentication

### Hygraph (GraphQL)

- **Method:** Bearer token in Authorization header
- **Configured in:** `src/api/graphql.ts`
- **Env var:** `HYGRAPH_AUTH_TOKEN`
- **Headers:** `{ authorization: \`Bearer ${process.env.HYGRAPH_AUTH_TOKEN}\` }`

### Dev.to (REST)

- **Method:** API key in custom header
- **Configured in:** `src/api/rest.ts`
- **Env var:** `DEVTO_KEY`
- **Headers:** `{ 'api-key': process.env.DEVTO_KEY || '' }`

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The upgrade does not modify auth mechanisms, env var handling, or expose any credentials to the client.

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
  - `profile.githubRecentProjects.repositories(first: 3, orderBy: UPDATED_AT DESC).nodes.id, name, description, url`
- **Response shape:** `Author` type (wraps `profile` object)
- **Used by:** `src/app/page.tsx` (Home)

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

#### Query: content_profile_githubRecentProjects (getRepos)

- **HTTP Method:** POST
- **Path:** `/v2/{adminId}/master`
- **Auth:** Bearer token required
- **Variables:** `{ id: process.env.HYGRAPH_USER_ID }`
- **Fields requested:**
  - `profile.contactDetail.email`
  - `profile.githubRecentProjects.repositories(first: 10, orderBy: UPDATED_AT DESC).nodes.id, name, description, url, primaryLanguage.name, primaryLanguage.color`
- **Response shape:** `Author` type
- **Used by:** `src/app/projects/page.tsx` (Projects)

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
- **Error handling:** Throws `Error('Failed to fetch blog posts')` if `!res.ok`
- **Used by:** `src/app/blog/page.tsx` (Blog)

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The upgrade explicitly excludes changing external API integrations. No new endpoints are added. Existing endpoints remain functionally identical; only the `graphql-request` library version is bumped, which is a client-side concern and does not alter the endpoint contract.

## 4. Common Error Format

- **REST API:** Throws `Error('Failed to fetch blog posts')` on non-200 response.
- **GraphQL:** `graphql-request` library throws on GraphQL errors (response-level errors). No custom error formatting.
- **No unified error handler:** Each API call handles errors independently. Server components propagate errors to Next.js error boundary.

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The upgrade does not add new error categories or modify existing error handling paths. The `graphql-request` library version bump may change the specific error type thrown by the library, but the error handling strategy (propagate to Next.js error boundary) remains the same.

## 5. Rate Limits

**Not documented in code.** Rate limits are imposed by:

- **Hygraph:** Based on plan tier (not specified in code)
- **Dev.to:** API rate limits documented at <https://developers.dev.to> (not specified in code)

No retry logic, caching headers, or rate limit handling implemented.

**Feature impact (proposal: `openspec/changes/current/proposal.md`):** No change. The upgrade does not introduce new rate-limited endpoints or modify rate limit behavior.
