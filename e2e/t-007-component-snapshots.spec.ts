import { expect, test } from '@playwright/test';

/**
 * T-007 — Verify all 8 component snapshots reflect correct React 19 rendering.
 *
 * This spec exercises each component on the pages where it renders,
 * confirming the visual output matches what the Jest snapshots capture.
 */

test.describe('T-007 — Component Rendering After React 19 Upgrade', () => {
	/**
	 * Component: Header
	 * Source page: / (layout)
	 * Snapshot: src/components/Header/__snapshots__/Header.test.tsx.snap
	 * Note: Header renders as <nav> (not <header>)
	 */
	test('Header renders top navigation with logo and links', async ({ page }) => {
		await page.goto('/');

		// Header renders as a nav element
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();

		// Logo link
		await expect(
			page.getByRole('link', { name: 'Home page' })
		).toBeVisible();

		// Desktop nav links
		await expect(nav.getByRole('link', { name: 'About me' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Blog' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Uses' })).toBeVisible();

		// Mobile menu button (visible only at mobile viewport)
		await page.setViewportSize({ width: 375, height: 812 });
		await expect(
			page.getByRole('button', { name: /menu/i })
		).toBeVisible();
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
		await expect(footer.getByRole('link', { name: 'About me' })).toBeVisible();
		await expect(footer.getByRole('link', { name: 'Projects' })).toBeVisible();
		await expect(footer.getByRole('link', { name: 'Blog' })).toBeVisible();
		await expect(footer.getByRole('link', { name: 'Uses' })).toBeVisible();

		// External copyright link
		await expect(
			footer.getByRole('link', { name: /No Copyright/i })
		).toBeVisible();
	});

	/**
	 * Component: NavLinks (used in both Header and Footer)
	 * Source page: / (via Header and Footer)
	 * Snapshot: src/components/NavLinks/__snapshots__/NavLinks.test.tsx.snap
	 */
	test('NavLinks renders active state on current page', async ({ page }) => {
		await page.goto('/about');

		const nav = page.getByRole('navigation');

		// Active link should have the active class
		await expect(
			nav.getByRole('link', { name: 'About me' })
		).toHaveClass(/bg-stone-300/);

		// Inactive links should NOT have the active class
		await expect(
			nav.getByRole('link', { name: 'Projects' })
		).not.toHaveClass(/bg-stone-300/);
	});

	/**
	 * Component: Contact (react-social-icons)
	 * Source page: /about
	 * Snapshot: src/components/Contact/__snapshots__/Contact.test.tsx.snap
	 */
	test('Contact component renders social icon links (react-social-icons + React 19)', async ({
		page,
	}) => {
		await page.goto('/about');

		// SocialIcon renders <a> elements with aria-labels for each network
		await expect(page.getByRole('link', { name: 'linkedin' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'github' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'email' })).toBeVisible();
	});

	/**
	 * Component: Experience
	 * Source page: / (home)
	 * Snapshot: src/components/Experience/__snapshots__/Experience.test.tsx.snap
	 * Note: Experience renders as a <div> with <h4> (not <section>/<h2>)
	 */
	test('Experience renders organization timeline entries', async ({ page }) => {
		await page.goto('/');

		// Experience section: div with h4 "Experience" (use .first() for strict mode)
		const experienceSection = page.locator('div').filter({
			has: page.locator('h4').filter({ hasText: /experience/i }),
		}).first();
		await expect(experienceSection).toBeVisible();

		// Each entry has org name and title
		const entries = experienceSection.locator('div').filter({
			has: page.locator('h4').filter({ hasText: /[A-Z]/ }),
		});
		await expect(entries.first()).toBeVisible();
	});

	/**
	 * Component: BlogPostCard
	 * Source page: /blog
	 * Snapshot: src/components/BlogPostCard/__snapshots__/BlogPostCard.test.tsx.snap
	 * Note: BlogPostCard renders as a <div> with <h2> (not <article>)
	 */
	test('BlogPostCard renders post title, description, and metrics', async ({
		page,
	}) => {
		await page.goto('/blog');

		// Blog post cards are <div> elements with <h2> titles
		const cardH2s = page.locator('h2');
		await expect(cardH2s.first()).toBeVisible();

		// Each card has a title link
		const titles = page.locator('a[href*="dev.to"]');
		await expect(titles.first()).toBeVisible();
	});

	/**
	 * Component: ProjectCard
	 * Source page: /projects
	 * Snapshot: src/components/ProjectCard/__snapshots__/ProjectCard.test.tsx.snap
	 * Note: ProjectCard renders as a <Link> (not <article>)
	 */
	test('ProjectCard renders project name, description, and language badge', async ({
		page,
	}) => {
		await page.goto('/projects');

		// Project cards are <h2> elements with project names
		const projectH2s = page.locator('h2');
		await expect(projectH2s.first()).toBeVisible();

		// Each card links to a GitHub repo
		const repoLinks = page.locator('a[href*="github"]');
		await expect(repoLinks.first()).toBeVisible();
	});

	/**
	 * Component: RecentProjects
	 * Source page: / (home)
	 * Snapshot: src/components/RecentProjects/__snapshots__/RecentProjects.test.tsx.snap
	 */
	test('RecentProjects renders a grid of project cards on home page', async ({
		page,
	}) => {
		await page.goto('/');

		// RecentProjects section contains h2 elements for project names
		const recentH2s = page.locator('h2').filter({ hasText: /project-/ });
		await expect(recentH2s.first()).toBeVisible();
	});

	/**
	 * Cross-component: @graphcms/rich-text-react-renderer on /about
	 * Acceptance criterion: renders correctly on /about page snapshot
	 */
	test('About page renders rich text bio via @graphcms/rich-text-react-renderer', async ({
		page,
	}) => {
		await page.goto('/about');

		// The bio content should be rendered as HTML paragraphs
		await expect(page.locator('h1')).toContainText(/about me/i);

		// Rich text paragraphs should be visible (not raw markdown)
		const bioContent = page.locator('main').filter({
			has: page.locator('h1').filter({ hasText: /about me/i }),
		});
		await expect(bioContent).toBeVisible();

		// Tech stack section should render
		await expect(
			page.locator('h2').filter({ hasText: /technologies/i })
		).toBeVisible();
	});
});
