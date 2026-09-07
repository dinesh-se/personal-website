# CMS Setup

This site is content-driven: the homepage renders personal content and
metadata from a headless CMS rather than hardcoding it in the repo. This
document gives a high-level, provider-agnostic overview of the content model
and what each section expects, so you can stand up the CMS against any
GraphQL-based headless CMS.

> **Note:** [Hygraph](https://hygraph.com) is used as the reference
> implementation here. The model described below maps cleanly onto any
> equivalent GraphQL CMS; adapt the field types to your provider's schema.

## 1. Content model

Create a single content model (e.g. `Profile`) with a **single record** that
holds the site's personal data. The following fields are consumed by the app:

| Field                 | Type      | Used by                                        |
| --------------------- | --------- | ---------------------------------------------- |
| `fullName`            | String    | Hero heading (`h1`) and hero image `alt`       |
| `summary`             | String    | Hero positioning/description paragraph         |
| `interests`           | String[]  | About section interests                        |
| `moreDetails`         | RichText  | About section bio (rendered rich text)         |
| `displayPicture`      | Asset     | Hero profile image                             |
| `resumeLink`          | String    | "Download Resume" button URL                   |
| `metaTitle`           | String    | `generateMetadata` title                       |
| `metaDescription`     | String    | `generateMetadata` description                 |
| `metaAuthorName`      | String    | `generateMetadata` authors.name                |
| `metaAuthorUrl`       | String    | `generateMetadata` authors.url                 |
| `contactDetail.email` | String    | Contact section email                          |
| `contactDetail.mobileNumber` | String[] | (reserved)                             |
| `socialMedia.linkedin`| String    | Contact section LinkedIn                       |
| `socialMedia.github`  | String    | Contact section GitHub                         |

### Required (page breaks without these)

- `fullName`
- `summary`
- `displayPicture`

### Metadata & resume (SEO + CTA)

The metadata block in `src/app/page.tsx` (`title`, `description`, `authors`)
and the resume link are sourced from the CMS. Keep these fields populated and
published to the **PUBLISHED** stage; if any is empty, the app degrades
gracefully (empty title, no resume button) rather than crashing.

## 2. Publishing

- Publish the profile record to the **PUBLISHED** stage. The app queries only
  published content (`stage: PUBLISHED`).
- Use the **en** locale for content.

## 3. Access tokens

- **Content API token (read/write)** — used by the app at runtime via
  `HYGRAPH_AUTH_TOKEN` to query the profile. Store it in `.env` (git-ignored).
- **Management API token** — used only for schema/content-model changes during
  setup. Never committed; not required at runtime.

## 4. Environment variables

| Variable             | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `HYGRAPH_ADMIN_ID`   | CMS project/admin endpoint ID                  |
| `HYGRAPH_AUTH_TOKEN` | Content API read/write token (Bearer)          |
| `HYGRAPH_USER_ID`    | ID of the single `Profile` record              |
| `DEVTO_KEY`          | Dev.to API key for the blog feed               |

See `.env.example` for the full list.

## 5. How the app consumes content

- `src/api/graphql.ts` — the single `getProfile` GraphQL query used by the
  homepage.
- `src/app/page.tsx` — renders the Hero, About, Contact sections and
  `generateMetadata` from the fetched profile.
- If the CMS query fails, the app renders empty fallbacks instead of crashing.

## 6. Adding or editing content

- Update the profile record in the CMS UI (or via a Content API mutation), then
  **publish** it. The site is cached (`use cache`), so changes appear after the
  cache revalidates (per `cacheLife` policy).
