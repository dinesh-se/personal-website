# UX Spec

## 1. Screen Inventory

No new screens are introduced by this feature. The feature adds a dark mode toggle button to the existing Header and adjusts color palette/typography, but does not add pages, routes, or fundamentally change screen layouts (`proposal.md`, "Out of scope" → "Adding new pages, features, or components"). The existing five screens remain unchanged:

### Home (`/`) — `src/app/page.tsx`

- **Purpose:** Landing page with greeting, hardcoded subline, and key sections
- **Layout:** Full-width container (max-w-7xl), centered
- **Sections:**
  1. Greeting: "Hello, I am" (text-3xl, no emoji)
  2. Name: "Dinesh Haribabu" (text-5xl, bold, gradient text)
  3. Subline: Hardcoded hero text ("Frontend by trade, architect by instinct…")
  4. Actions: "Download Resume" CTA (gradient button → link.dineshharibabu.in/resume) + Contact social icons (LinkedIn, GitHub, email; GitHub kept)
  5. Link: "More about me" → `/about`
  6. Latest from the blog: up to 3 BlogPostCard items (grid); "View all posts →" link to `/blog` shown only when total > 3
  7. Experience: Full-width organization timeline (Experience component, resume button removed from card)
- **Data source:** Hygraph (getUser query) + Dev.to (cached getBlogFeed)
- **Caching:** `use cache` + `cacheLife('days')`
- **Note:** The Hygraph `summary` field is no longer rendered on home; the hero subline is hardcoded (CMS sync pending).

### About (`/about`) — `src/app/about/page.tsx`

- **Purpose:** Detailed bio with tech stack showcase
- **Layout:** Two-column on desktop (bio + image), single column on mobile
- **Sections:**
  1. Heading: "A little more about me!" (text-3xl)
  2. Bio: Rich text content from Hygraph (RichText component with custom p and code renderers)
  3. Display picture: 360x360 image with rounded corners and rotation (next/image)
  4. Contact: LinkedIn, GitHub, email buttons
  5. Self-hosted AI stack callout: Code-managed section with factual copy and link to the `strix-halo-llm-stack` repo
  6. Tech stack section: Gray background, centered logo grid (React, Angular, TypeScript, RxJS, Next.js, Tailwind CSS, Hygraph, Storybook, Cypress)
- **Data source:** Hygraph (getMoreDetails query)
- **Caching:** `use cache` + `cacheLife('days')`

### Blog (`/blog`) — `src/app/blog/page.tsx`

- **Purpose:** Display published Dev.to articles
- **Layout:** Centered grid (sm:mx-16, md:mx-24, lg:mx-32), 1-column
- **Sections:**
  1. Heading: "Blog Posts" (text-3xl)
  2. Intro text: "I write about web development..." with link to dev.to
  3. Blog post cards: List of BlogPostCard components (title, description, date, reactions, comments, views)
- **Data source:** Dev.to REST API via server-side cached `getBlogFeed` (`use cache` + `cacheLife('hours')`); BlogContent keeps its client-side `/api/articles/me/published` fallback for graceful degradation
- **Route handler:** `/api/articles/me/published` resolves the cached result and returns `{ success, total, posts }`

### Uses (`/uses`) — `src/app/uses/page.tsx`

- **Purpose:** Developer tools and tech stack list
- **Layout:** Two-column (title left, list right) per category
- **Sections:**
  1. Heading: "Uses" (text-3xl)
  2. Intro text: Reference to Wes Bos's Uses.Tech project with link
  3. Categories: Each Uses category (id, title) with list of items (name, description)
- **Data source:** Hygraph (getUses query)
- **Revalidation:** 600s ISR

## 2. Navigation Map

No new routes or navigation connections are introduced. All existing navigation remains unchanged:

### Header Navigation (`src/components/Header/Header.tsx`)

- **Desktop:** Horizontal link list (About me, Blog, Uses) + logo
- **Mobile:** Hamburger menu button → dropdown with same links
- **Note:** The Projects link was removed with the Projects page.
- **Active state:** `pathname === href` → `bg-stone-300 dark:bg-gray-900`
- **Default state:** `hover:text-black dark:hover:bg-gray-700 dark:hover:text-white`
- **Mobile menu:** Toggled via `useState(false)`, controlled by `isMobileMenuOpen`

### Footer Navigation (`src/components/Footer/Footer.tsx`)

- **Links:** Home, About me, Blog, Uses (Projects link removed)
- **Active state:** `font-semibold`
- **Default state:** `text-neutral-500 hover:text-slate-700 dark:hover:text-white`
- **External link:** "No Copyright" → <https://creativecommons.org/publicdomain/zero/1.0/deed.en>

### Navigation Component (`src/components/NavLinks/NavLinks.tsx`)

- **Reusable:** Used in both Header and Footer
- **Active detection:** `usePathname()` from Next.js Navigation
- **Props:** `links`, `linkActiveState`, `linkDefaultState`, `otherStyleClasses`

## 3. Component Library

No new components are introduced. Seven of eight existing components remain unchanged in structure; the Header component gains a dark mode toggle button and focus trap for the mobile menu.

### Layout Components

- **Header:** Top navigation bar (bg-gray-900, h-16), responsive mobile menu
- **Footer:** Bottom bar with nav links and copyright link (border-top, flex row on desktop)

### Navigation Components

- **NavLinks:** Reusable link list with active state highlighting
- **Contact:** Social media buttons (LinkedIn, GitHub, email) using react-social-icons

### Content Components

- **Experience:** Organization timeline (orgName, title, from/to, orgLogo; resume button removed from card)
- **BlogPostCard:** Blog post preview (title, description, date, reactions, comments, views); reused on the home "Latest from the blog" strip
- **ProjectCard:** Removed (Projects page deleted)
- **RecentProjects:** Removed (Recent Works section deleted)

### Styling

- **Dark mode:** `prefers-color-scheme: dark` media query + Tailwind `dark:` variants. **Feature changes:** strategy from `media` to `class` — root `<html>` toggled via `class="dark"` by Header component.
- **CSS custom properties:** `--primary-color`, `--foreground-rgb`, `--background-start-rgb`, `--background-end-rgb`, `--logo-filter`, `--social-icon-fill`
- **Responsive breakpoints:** sm (640px), lg (1024px)
- **Typography:** Tailwind utility classes (text-3xl, text-5xl, font-bold, etc.)
- **Layout:** Flexbox and CSS Grid (flex, grid, grid-cols-1/2/3)

## 4. Screen Specs

### Responsive Behavior

- **Mobile (< 640px):** Single column, hamburger menu, stacked layout
- **Tablet (640px - 1024px):** 2-column grids, horizontal nav, side-by-side sections
- **Desktop (> 1024px):** 3-column grids, horizontal nav, max-w-7xl container

### Interactions

- **Mobile menu:** Toggle open/close with hamburger/close icons
- **Nav active state:** Highlighted when pathname matches href
- **Hover states:** All links have hover color changes
- **Image hover:** About page display picture has md:rotate-3 transform

### Accessibility

- **ARIA labels:** Logo has `aria-label="Home page"`, mobile menu button has `aria-controls` and `aria-expanded`
- **Screen readers:** "Open main menu" label (sr-only), social icons have aria-labels
- **Focus management:** Focus ring on mobile menu button (focus:ring-2)
- **Semantic HTML:** nav, main, footer, section, h1-h2 hierarchy

## 5. Form Validations

No forms exist in this application. The Contact component renders social media buttons (LinkedIn, GitHub, email) using `react-social-icons` — none accept user input. The acceptance criteria verify page rendering and navigation behavior but contain no form-related requirements (`proposal.md`, "Acceptance Criteria" items 1–10). No form validation rules are applicable.

## 6. Responsive Breakpoints

No new breakpoints are introduced. The existing Tailwind breakpoint configuration remains unchanged. **Feature changes:** `tailwind.config.ts` dark mode strategy from `media` to `class` (affects Tailwind config but not breakpoints).

| Breakpoint | Size              | Usage                                                   |
| ---------- | ----------------- | ------------------------------------------------------- |
| **Mobile** | < 640px (default) | Single-column layouts, hamburger menu, stacked sections |
| **sm**     | ≥ 640px           | 2-column grids, horizontal navigation                   |
| **lg**     | ≥ 1024px          | 3-column grids, max-w-7xl centered container            |

These breakpoints are defined in `tailwind.config.ts` and applied across all five pages. The feature modifies `tailwind.config.ts` only for the dark mode strategy (`media` → `class`) and color palette adjustments — no new breakpoint-dependent layouts are introduced (`proposal.md`, "Out of scope" → "Adding new pages, features, or components").
