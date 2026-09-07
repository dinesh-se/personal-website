# UX Spec

## 1. Screen Inventory

The site is a **single-page homepage** — the only route is `/` (plus `/_not-found`, the Dev.to proxy API route, `robots.txt`, and `sitemap.xml`). The former `/about`, `/blog`, and `/uses` routes (and their components) were removed in the single-page redesign.

### Home (`/`) — `src/app/page.tsx`

- **Purpose:** Single-page landing with greeting, hardcoded subline, and in-page sections
- **Layout:** Centered container (max-w-5xl)
- **Sections:**
  1. Greeting: "Hello, I am" (text-base, uppercase, letter-spaced)
  2. Name: "Dinesh Haribabu" (text-5xl/6xl, extrabold, **gradient text** via `bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600`)
  3. Subline: Hardcoded hero text ("Frontend by trade, architect by instinct…")
  4. Display picture: **square with rounded corners** (`rounded-2xl`), ring border
  5. About: rich-text bio (`moreDetails`) + Interests callout
  6. Writing: up to 3 BlogPostCard items (grid); "View all posts on Dev.to →" link shown only when total > 3
  7. Contact: "Download Resume" CTA (gradient button → link.dineshharibabu.in/resume) + Contact social icons (LinkedIn, GitHub, email; GitHub kept)
- **Data source:** Hygraph (`getProfile` query) + Dev.to (cached `getBlogFeed`)
- **Caching:** `use cache` + `cacheLife('days')`
- **Note:** The Hygraph `summary` field is no longer rendered on home; the hero subline is hardcoded.

## 2. Navigation Map

Navigation is **in-page anchor links** only (no routes). Clicking a top-nav link scrolls smoothly to the target section (`scroll-behavior: smooth` with `scroll-margin-top` offset for the sticky header).

### Header Navigation (`src/components/Header/Header.tsx`)

- **Desktop:** Horizontal link list (About / Writing / Contact) + logo
- **Mobile:** Hamburger menu button → dropdown with same links
- **Style:** Transparent/blended header (`bg-white/70 dark:bg-stone-950/70` + backdrop blur, sticky top), slim `h-14`, theme-aware link colors (stone-500 in light, stone-400 in dark)
- **Logo:** Theme-aware fill via `--logo-filter` (dark in light mode, light in dark mode) for contrast against both themes
- **Active state:** `pathname === href` → `bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-50`
- **Default state:** `text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50`
- **Mobile menu:** Toggled via `useState(false)`, controlled by `isMobileMenuOpen`, with focus trap and Escape-to-close

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

Components are scoped to the single-page layout. Experience, ProjectCard, RecentProjects, and the old multi-page route components were removed.

### Layout Components

- **Header:** Slim transparent/sticky top bar (`bg-white/70 dark:bg-stone-950/70` + backdrop blur, `h-14`), responsive mobile menu with focus trap
- **Footer:** Bottom bar with nav links and copyright link (border-top, flex row on desktop)

### Navigation Components

- **NavLinks:** Reusable in-page anchor link list with active state highlighting
- **Contact:** Social media buttons (LinkedIn, GitHub, email) using react-social-icons

### Content Components

- **Hero:** Greeting, gradient name, hardcoded subline, square display picture (`rounded-2xl`)
- **About:** Rich-text bio (`moreDetails`) + Interests callout
- **BlogPostCard:** Blog post preview (title, description, **compact date**, reactions, comments, views); reused on the "Latest from the blog" strip. The date renders as a right-aligned `<time>` element (e.g. "1 Apr 2023") — no "Published at:" label.

### Styling

- **Dark mode:** `prefers-color-scheme: dark` media query + Tailwind `dark:` variants (`media` strategy, unchanged)
- **CSS custom properties:** `--primary-color`, `--foreground-rgb`, `--background-start-rgb`, `--background-end-rgb`, `--logo-filter`, `--social-icon-fill`
- **Gradients:** Hero name (`bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600`) and Download Resume button use the same sky→indigo→fuchsia gradient
- **Smooth scroll:** `html { scroll-behavior: smooth }` in `globals.css`; anchored sections get `scroll-margin-top: 4.5rem` to offset the sticky header
- **Responsive breakpoints:** sm (640px), lg (1024px)
- **Typography:** Tailwind utility classes (text-3xl, text-5xl, font-extrabold, etc.)
- **Layout:** Flexbox and CSS Grid (flex, grid, grid-cols-1/2/3)

## 4. Screen Specs

### Responsive Behavior

- **Mobile (< 640px):** Single column, hamburger menu, stacked layout
- **Tablet (640px - 1024px):** 2-column grids, horizontal nav, side-by-side sections
- **Desktop (> 1024px):** 3-column grids, horizontal nav, max-w-5xl centered container

### Interactions

- **Mobile menu:** Toggle open/close with hamburger/close icons
- **Nav active state:** Highlighted when pathname matches href
- **Hover states:** All links have hover color changes
- **Smooth scrolling:** Anchor nav links scroll smoothly to in-page sections (`scroll-behavior: smooth`), disabled under `prefers-reduced-motion`

### Accessibility

- **ARIA labels:** Logo has `aria-label="Home page"`, mobile menu button has `aria-controls` and `aria-expanded`
- **Screen readers:** "Open main menu" label (sr-only), social icons have aria-labels
- **Focus management:** Focus ring on mobile menu button (focus:ring-2); focus trap + Escape-to-close in the mobile menu
- **Semantic HTML:** nav, main, footer, section, h1-h2 hierarchy

## 5. Form Validations

No forms exist in this application. The Contact component renders social media buttons (LinkedIn, GitHub, email) using `react-social-icons` — none accept user input. The acceptance criteria verify page rendering and navigation behavior but contain no form-related requirements (`proposal.md`, "Acceptance Criteria" items 1–10). No form validation rules are applicable.

## 6. Responsive Breakpoints

No new breakpoints are introduced. The existing Tailwind breakpoint configuration remains unchanged (dark mode stays on the `media` strategy).

| Breakpoint | Size              | Usage                                                   |
| ---------- | ----------------- | ------------------------------------------------------- |
| **Mobile** | < 640px (default) | Single-column layouts, hamburger menu, stacked sections |
| **sm**     | ≥ 640px           | 2-column grids, horizontal navigation                   |
| **lg**     | ≥ 1024px          | 3-column grids, max-w-5xl centered container            |

These breakpoints are defined in `tailwind.config.ts` and applied across the single-page layout.
