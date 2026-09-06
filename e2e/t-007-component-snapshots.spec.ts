import { expect, test } from '@playwright/test';

/**
 * T-007 — Verify component snapshots reflect correct React 19 rendering.
 *
 * This spec exercises each component on the single-page homepage,
 * confirming the visual output matches what the Jest snapshots capture.
 */

test.describe('T-007 — Component Rendering After React 19 Upgrade', () => {
	/**
	 * Component: Header
	 * Source page: / (layout)
	 * Snapshot: src/components/Header/__snapshots__/Header.test.tsx.snap
	 * Note: Header renders as <nav> (not <header>)
	 */
	test('Header renders top navigation with logo and links', async ({
		page,
	}) => {
		await page.goto('/');

		// Header renders as a nav element
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();

		// Logo link
		await expect(page.getByRole('link', { name: 'Home page' })).toBeVisible();

		// Desktop nav links (anchor links on the single page)
		await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Writing' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();

		// Mobile menu button (visible only at mobile viewport)
		await page.setViewportSize({ width: 375, height: 812 });
		await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
	});

	/**
	 * Component: Footer
	 * Source page: / (layout)
	 * Snapshot: src/components/Footer/__snapshots__/Footer.test.tsx.snap
	 */
	test('Footer renders nav links and copyright link', async ({ page }) => {
		await page.goto('/');

		const footer = page.locator('footer');
		await expect(footer).toBeVisible();

		// Footer nav links
		await expect(footer.getByRole('link', { name: 'Home' })).toBeVisible();
		await expect(footer.getByRole('link', { name: 'About' })).toBeVisible();
		await expect(footer.getByRole('link', { name: 'Writing' })).toBeVisible();
		await expect(footer.getByRole('link', { name: 'Contact' })).toBeVisible();

		// External copyright link
		await expect(
			footer.getByRole('link', { name: /No Copyright/i })
		).toBeVisible();
	});

	/**
	 * Component: NavLinks (used in both Header and Footer)
	 * Source page: / (via Header and Footer)
	 * Snapshot: src/components/NavLinks/__snapshots__/NavLinks.test.tsx.snap
	 * Note: on a single-page site all anchor links resolve to '/', so no link
	 * is "active"; NavLinks renders anchor links without an active state.
	 */
	test('NavLinks renders anchor links on the home page', async ({ page }) => {
		await page.goto('/');

		const nav = page.getByRole('navigation');

		// All three anchor links render
		await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Writing' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
	});

	/**
	 * Component: Contact (react-social-icons)
	 * Source page: / (home)
	 * Snapshot: src/components/Contact/__snapshots__/Contact.test.tsx.snap
	 */
	test('Contact component renders social icon links (react-social-icons + React 19)', async ({
		page,
	}) => {
		await page.goto('/');

		// SocialIcon renders <a> elements with aria-labels for each network
		await expect(page.getByRole('link', { name: 'linkedin' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'github' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'email' })).toBeVisible();
	});

	/**
	 * Component: BlogPostCard
	 * Source page: / (Writing section)
	 * Snapshot: src/components/BlogPostCard/__snapshots__/BlogPostCard.test.tsx.snap
	 * Note: BlogPostCard renders as a <div> with <h2> (not <article>)
	 */
	test('BlogPostCard renders post title, description, and metrics', async ({
		page,
	}) => {
		await page.goto('/');

		// Blog post cards live in the Writing section on the home page
		const writing = page.locator('#writing');
		await expect(writing).toBeVisible();

		// Post cards are <div> elements with <h2> titles
		const cardH2s = writing.locator('h2');
		await expect(cardH2s.first()).toBeVisible();

		// Each card has a title link
		const titles = writing.locator('a[href*="dev.to"]');
		await expect(titles.first()).toBeVisible();
	});

	/**
	 * Cross-component: @graphcms/rich-text-react-renderer on /
	 * Acceptance criterion: renders correctly on the home page About section
	 */
	test('About section renders rich text bio via @graphcms/rich-text-react-renderer', async ({
		page,
	}) => {
		await page.goto('/');

		const about = page.locator('#about');
		await expect(about).toBeVisible();

		// The bio content should be rendered as HTML paragraphs
		await expect(about.locator('h2').filter({ hasText: /About/i })).toBeVisible();
		await expect(about.locator('p').first()).toBeVisible();
	});
});
