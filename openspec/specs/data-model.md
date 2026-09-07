# Data Model

## 1. Core Entities

**No persistent data model — stateless service.** All data types are TypeScript interfaces in `src/types/`. Data is fetched from external APIs (Hygraph GraphQL, Dev.to REST) at build/runtime with caching.

The single-page homepage redesign introduced **no new Hygraph models or schema changes**. It trimmed the type surface: `Experience`/`Organization`/`Uses` types were dropped, and `interests` was added to the profile.

### Author (`src/types/author.ts`)

The primary entity, representing the website owner's profile.

```typescript
interface Author {
	profile: Profile;
}

interface Profile {
	fullName: string;
	summary: string;
	interests: string[];
	contactDetail: ContactDetail;
	displayPicture: DisplayPicture;
	moreDetails: MoreDetails;
}

interface ContactDetail {
	email: string;
	mobileNumber: string[];
	socialMedia: SocialMedia;
}

interface SocialMedia {
	linkedin: string;
	github: string;
}

interface DisplayPicture {
	url: string;
}

interface MoreDetails {
	raw: RichTextContent; // From @graphcms/rich-text-types
}
```

### BlogPost (`src/types/blog-post.ts`)

Represents a blog post from Dev.to.

```typescript
interface BlogPost {
	id: string;
	title: string;
	description: string;
	published_at: string; // ISO date string
	url: string;
	comments_count: number;
	public_reactions_count: number;
	page_views_count: number;
}

interface BlogPostUI {
	id?: string;
	title: string;
	description: string;
	url: string;
	date: Date; // Transformed from published_at
	commentsCount: number; // Transformed from comments_count
	reactionsCount: number; // Transformed from public_reactions_count
	pageViewsCount: number; // Transformed from page_views_count
}
```

### NavLinks (`src/types/nav-links.ts`)

Component props for navigation links.

```typescript
interface NavLinks {
	links: Link[];
	linkActiveState: string;
	linkDefaultState?: string;
	otherStyleClasses?: string;
}

interface Link {
	label: string;
	href: string;
}
```

### Derived Types

```typescript
// Contact (src/types/author.ts) — combines social media and email
interface Contact extends SocialMedia, Pick<ContactDetail, 'email'> {}
```

## 2. Relationships

- **Author → Profile:** One-to-one (Author has one profile)
- **Profile → ContactDetail:** One-to-one
- **Profile → DisplayPicture:** One-to-one
- **Profile → MoreDetails:** One-to-one (RichTextContent)
- **Profile → Interests:** One-to-many (string array)
- **BlogPost → BlogPostUI:** Transformation (not relational)

> **Removed (single-page redesign):** `Profile → Experience` (one-to-one), `Experience → Organization` (one-to-many), `Profile → Uses` (one-to-many), `Uses → Item` (one-to-many).

## 3. Migration Strategy

**Not applicable.** No database, no ORM, no migrations. Data schema is defined by external APIs (Hygraph GraphQL schema, Dev.to REST API schema). Type definitions in `src/types/` reflect the API responses.

The redesign removed type definitions (`Experience`, `Organization`, `Uses`) and the `uses.ts` file; no schema migration was required since no Hygraph model changed.

## 4. Seed Data

**Not applicable.** No local data. All data comes from:

- **Hygraph:** Live GraphQL query `getProfile()` in `src/api/graphql.ts` (profile, interests, moreDetails, contact detail, display picture).
- **Dev.to:** Live REST API calls (blog posts) — fetched via `getBlogFeed()` in `src/api/rest.ts`.

## 5. Data Retention Policy

**Not applicable.** This is a static site with no user data collection, no local storage, no sessions. Data is fetched fresh on each build/revalidation. No data is persisted client-side. The dark mode preference stored in localStorage is client-side only and not tracked as user data.
