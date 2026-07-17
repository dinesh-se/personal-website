# UX Spec — As-Is

## 1. Screen Inventory

### Home (`/`) — `src/app/page.tsx`

- **Purpose:** Landing page with greeting, summary, and key sections
- **Layout:** Full-width container (max-w-7xl), centered
- **Sections:**
  1. Greeting: "👋 Hello, I am" (text-3xl)
  2. Name: "Dinesh Haribabu" (text-5xl, bold, gradient text)
  3. Summary: From Hygraph profile.summary
  4. Link: "More about me" → `/about`
  5. Contact: LinkedIn, GitHub, email buttons (Contact component)
  6. Recent Projects: 3-column grid of project cards (RecentProjects component)
  7. Experience: Organization timeline (Experience component)
- **Data source:** Hygraph (getUser query)
- **Revalidation:** 600s ISR

### About (`/about`) — `src/app/about/page.tsx`

- **Purpose:** Detailed bio with tech stack showcase
- **Layout:** Two-column on desktop (bio + image), single column on mobile
- **Sections:**
  1. Heading: "A little more about me!" (text-3xl)
  2. Bio: Rich text content from Hygraph (RichText component with custom p and code renderers)
  3. Display picture: 360x360 image with rounded corners and rotation (next/image)
  4. Contact: LinkedIn, GitHub, email buttons
  5. Tech stack section: Gray background, centered logo grid (React, Angular, TypeScript, RxJS, Next.js, Tailwind CSS, Hygraph, Storybook, Cypress)
- **Data source:** Hygraph (getMoreDetails query)
- **Revalidation:** 600s ISR

### Projects (`/projects`) — `src/app/projects/page.tsx`

- **Purpose:** Showcase GitHub repositories
- **Layout:** 3-column grid on desktop, 2-column on tablet, 1-column on mobile
- **Sections:**
  1. Heading: "GitHub Projects" (text-3xl)
  2. Project cards: Grid of ProjectCard components (name, description, language badge, link to repo)
  3. Contact CTA: "To know more... contact me" with mailto link
- **Data source:** Hygraph (getRepos query, first 10 repos)
- **Revalidation:** 600s ISR

### Blog (`/blog`) — `src/app/blog/page.tsx`

- **Purpose:** Display published Dev.to articles
- **Layout:** Centered grid (sm:mx-16, md:mx-24, lg:mx-32), 1-column
- **Sections:**
  1. Heading: "Blog Posts" (text-3xl)
  2. Intro text: "I write about web development..." with link to dev.to
  3. Blog post cards: List of BlogPostCard components (title, description, date, reactions, comments, views)
- **Data source:** Dev.to REST API (getBlogPosts)
- **Revalidation:** 600s ISR

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

### Header Navigation (`src/components/Header/Header.tsx`)

- **Desktop:** Horizontal link list (About me, Projects, Blog, Uses) + logo
- **Mobile:** Hamburger menu button → dropdown with same links
- **Active state:** `pathname === href` → `bg-stone-300 dark:bg-gray-900`
- **Default state:** `hover:text-black dark:hover:bg-gray-700 dark:hover:text-white`
- **Mobile menu:** Toggled via `useState(false)`, controlled by `isMobileMenuOpen`

### Footer Navigation (`src/components/Footer/Footer.tsx`)

- **Links:** Home, About me, Projects, Blog, Uses (same as header but includes Home)
- **Active state:** `font-semibold`
- **Default state:** `text-neutral-500 hover:text-slate-700 dark:hover:text-white`
- **External link:** "No Copyright" → <https://creativecommons.org/publicdomain/zero/1.0/deed.en>

### Navigation Component (`src/components/NavLinks/NavLinks.tsx`)

- **Reusable:** Used in both Header and Footer
- **Active detection:** `usePathname()` from Next.js Navigation
- **Props:** `links`, `linkActiveState`, `linkDefaultState`, `otherStyleClasses`

## 3. Component Library

### Layout Components

- **Header:** Top navigation bar (bg-gray-900, h-16), responsive mobile menu
- **Footer:** Bottom bar with nav links and copyright link (border-top, flex row on desktop)

### Navigation Components

- **NavLinks:** Reusable link list with active state highlighting
- **Contact:** Social media buttons (LinkedIn, GitHub, email) using react-social-icons

### Content Components

- **Experience:** Organization timeline (orgName, title, from/to, orgLogo)
- **BlogPostCard:** Blog post preview (title, description, date, reactions, comments, views)
- **ProjectCard:** Project card (name, description, language badge, link)
- **RecentProjects:** Project grid container (renders ProjectCard components)

### Styling

- **Dark mode:** `prefers-color-scheme: dark` media query + Tailwind `dark:` variants
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
