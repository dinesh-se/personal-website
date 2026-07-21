# T-005: About Page Rich Text Semantic HTML

## Goal

Ensure the `/about` page's rich text content (rendered from Hygraph via `@graphcms/rich-text-react-renderer`) produces semantic HTML — headings, paragraphs, lists, and code blocks — instead of generic `<div>` wrappers, so screen readers and axe-core can interpret the content correctly.

## Covers features

- Semantic HTML
- Rich text a11y

## Covers scenarios

- WCAG 2.1 / 1.3.1 Info and Relationships — content structure conveyed through semantic markup
- WCAG 2.1 / 4.1.1 Parsing — no duplicate attribute IDs, proper nesting

## Dependencies

- **None**

## Acceptance criteria

- [ ] **AC-1:** `/about` page has exactly one `<h1>` element (the page title, not from rich text) — Tests: `e2e/about-semantic.spec.ts` asserts `page.locator('h1').count() === 1`
- [ ] **AC-2:** Rich text headings from Hygraph render as `<h2>`–`<h6>` (not `<div>` with heading styles) — Tests: `e2e/about-semantic.spec.ts` asserts `page.locator('main').locator('h2, h3, h4, h5, h6')` finds expected elements
- [ ] **AC-3:** Rich text paragraphs render as `<p>` elements (not `<div>`) — Tests: `e2e/about-semantic.spec.ts` asserts `page.locator('main').locator('p')` finds expected elements
- [ ] **AC-4:** Rich text ordered/unordered lists render as `<ol>`/`<ul>` with `<li>` children (not `<div>`) — Tests: `e2e/about-semantic.spec.ts` asserts `page.locator('main').locator('ul, ol')` finds expected elements
- [ ] **AC-5:** Rich text code blocks render as `<pre>` with `<code>` inside — Tests: `e2e/about-semantic.spec.ts` asserts `page.locator('main').locator('pre code')` finds expected elements
- [ ] **AC-6:** No skipped heading levels in the rich text (e.g., `<h3>` followed by `<h5>` without `<h4>`) — Tests: `e2e/about-semantic.spec.ts` checks heading sequence via `page.locator('main h2, h3, h4, h5, h6')` order
- [ ] **AC-7:** axe-core CLI reports zero landmark and heading-order violations on `/about` — Tests: `npx axe-core http://localhost:3000/about --rules landmark, heading-order` exits 0

## User test

Run `npm run dev`, visit `/about`, open browser dev tools, inspect the rich text content section. Verify headings use `<h2>`–`<h6>`, paragraphs use `<p>`, lists use `<ul>`/`<ol>` with `<li>`, and code blocks use `<pre><code>`. Run `npx axe-core http://localhost:3000/about --rules landmark, heading-order` and verify zero violations.

## Tests

- **axe-core CLI:** `npx axe-core http://localhost:3000/about --rules landmark, heading-order` — zero violations
- **Playwright E2E:** `e2e/about-semantic.spec.ts` — Verify rich text section contains semantic elements (`<h2>`, `<p>`, `<ul>`, `<ol>`, `<pre>`) via `page.locator('main').locator('h2, p, ul, ol, pre')` selectors

## Files likely touched

- `src/app/about/page.tsx`
- `src/app/about/RichText.tsx` (or wherever the rich text renderer is configured)
- `e2e/about-semantic.spec.ts`

## Do NOT

- Modify semantic HTML on pages other than `/about` (Home, Projects, Blog, Uses)
- Change the rich text content fetched from Hygraph
- Add new dependencies — use the existing `@graphcms/rich-text-react-renderer`
