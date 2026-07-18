# Data Model — As-Is

## 1. Core Entities

**No persistent data model — stateless service.** All data types are TypeScript interfaces in `src/types/`. Data is fetched from external APIs at build/runtime.

### Author (`src/types/author.ts`)

The primary entity, representing the website owner's profile.

```typescript
interface Author {
	profile: Profile;
}

interface Profile {
	fullName: string;
	summary: string;
	contactDetail: ContactDetail;
	experience: Experience;
	displayPicture: DisplayPicture;
	moreDetails: MoreDetails;
	githubRecentProjects: GithubRecentProjects;
	uses: Uses[];
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

interface Experience {
	organizations: Organization[];
}

interface Organization {
	orgName: string;
	title: string;
	from: string; // Format: "YYYY-MM"
	to: string; // Format: "YYYY-MM"
	orgLogo: OrgLogo;
}

interface OrgLogo {
	url: string;
}

interface DisplayPicture {
	url: string;
}

interface MoreDetails {
	raw: RichTextContent; // From @graphcms/rich-text-types
}

interface Repo {
	id: string;
	name: string;
	description: string;
	url: string;
	primaryLanguage?: PrimaryLanguage;
}

interface PrimaryLanguage {
	name: string;
	color: string;
}

type GithubRecentProjects = {
	repositories: {
		nodes: Repo[];
	};
};
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

### Uses (`src/types/uses.ts`)

Represents a category of tools/tech with items.

```typescript
interface Uses {
	id: string;
	title: string;
	list: Item[];
}

interface Item {
	id: string;
	name: string;
	description: string;
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

### Contact (`src/types/author.ts`)

Derived type combining social media and email.

```typescript
interface Contact extends SocialMedia, Pick<ContactDetail, 'email'> {}
```

### RepoUI (`src/types/author.ts`)

Derived type for project cards.

```typescript
interface RepoUI extends Omit<Repo, 'id' | 'url'> {
	href: Repo['url'];
}
```

## 2. Relationships

- **Author → Profile:** One-to-one (Author has one profile)
- **Profile → ContactDetail:** One-to-one
- **Profile → Experience:** One-to-one
- **Experience → Organization:** One-to-many
- **Profile → GithubRecentProjects:** One-to-one
- **GithubRecentProjects → Repo:** One-to-many (via `repositories.nodes`)
- **Profile → Uses:** One-to-many
- **Uses → Item:** One-to-many
- **BlogPost → BlogPostUI:** Transformation (not relational)

## 3. Migration Strategy

**Not applicable.** No database, no ORM, no migrations. Data schema is defined by external APIs (Hygraph GraphQL schema, Dev.to REST API schema). Type definitions in `src/types/` reflect the API responses.

## 4. Seed Data

**Not applicable.** No local data. All data comes from:

- Hygraph: Live GraphQL queries (profile, experience, projects, uses)
- Dev.to: Live REST API calls (blog posts)

## 5. Data Retention Policy

**Not applicable.** This is a static site with no user data collection, no local storage, no sessions. Data is fetched fresh on each build/revalidation (600s ISR). No data is persisted client-side.
