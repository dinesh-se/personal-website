import { expect, test } from '@playwright/test';

test.describe('T-002 — Upgrade All Other Direct Dependencies', () => {
	test('about page renders with social icons from react-social-icons', async ({
		page,
	}) => {
		await page.goto('/about');

		// Page renders without crashes — heading from the about page
		await expect(
			page.getByRole('heading', { level: 1, name: /about me/i })
		).toBeVisible();

		// Social icons from react-social-icons render as accessible links
		await expect(page.getByRole('link', { name: 'linkedin' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'github' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'email' })).toBeVisible();

		// Tech stack section renders (uses @svgr/webpack for SVG loading).
		// The about page also has a "Self-hosted AI stack" h2 callout, so scope
		// to the technologies heading specifically.
		await expect(
			page.getByRole('heading', { name: /Some of my favorite/i })
		).toBeVisible();
	});

	test('home page renders Contact component with social icons from react-social-icons', async ({
		page,
	}) => {
		await page.goto('/');

		// Core page content renders
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();

		// Contact component renders social icon links
		await expect(page.getByRole('link', { name: 'linkedin' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'github' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'email' })).toBeVisible();
	});

	test('all pages render without crashes after dependency upgrade', async ({
		page,
	}) => {
		const routes = [
			{ path: '/', title: 'Dinesh Haribabu' },
			{ path: '/about', title: /about me/i },
			{ path: '/blog', title: /Blog Posts/i },
			{ path: '/uses', title: /Uses/i },
		];

		for (const { path: route, title } of routes) {
			await page.goto(route);
			await expect(
				page.getByRole('heading', { level: 1, name: title })
			).toBeVisible();
			await expect(page.getByRole('navigation')).toBeVisible();
			await expect(page.locator('footer')).toBeVisible();
		}
	});

	test('navigation between pages works after dependency upgrade', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();

		const nav = page.getByRole('navigation');

		await nav.getByRole('link', { name: 'About me' }).click();
		await expect(page).toHaveURL('/about');
		await expect(
			page.getByRole('heading', { level: 1, name: /about me/i })
		).toBeVisible();

		await nav.getByRole('link', { name: 'Blog' }).click();
		await expect(page).toHaveURL('/blog');
		await expect(
			page.getByRole('heading', { level: 1, name: /Blog Posts/i })
		).toBeVisible();

		await nav.getByRole('link', { name: 'Uses' }).click();
		await expect(page).toHaveURL('/uses');
		await expect(
			page.getByRole('heading', { level: 1, name: /Uses/i })
		).toBeVisible();

		// Navigate back
		await nav.getByRole('link', { name: 'About me' }).click();
		await expect(page).toHaveURL('/about');
	});

	test('uses page renders content from graphql-request data fetch', async ({
		page,
	}) => {
		await page.goto('/uses');

		await expect(
			page.getByRole('heading', { level: 1, name: /Uses/i })
		).toBeVisible();

		// Intro text referencing Wes Bos's Uses.Tech should be present
		await expect(
			page.getByRole('link', { name: "Wes Bos's Uses.Tech" })
		).toBeVisible();

		// Uses categories render from live Hygraph data (category titles are
		// content-managed, so assert that at least one category heading renders
		// rather than a fixture-specific title).
		await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
	});

	test('blog page renders content from dev.to API fetch', async ({ page }) => {
		await page.goto('/blog');

		await expect(
			page.getByRole('heading', { level: 1, name: /Blog Posts/i })
		).toBeVisible();

		// Blog post cards render from live Dev.to data. Post titles are
		// content-managed, so assert that at least one post card (a link to
		// dev.to) renders rather than a fixture-specific title.
		await expect(page.locator('a[href*="dev.to"]').first()).toBeVisible();
	});

	test('footer navigation links are functional after dependency upgrade', async ({
		page,
	}) => {
		await page.goto('/');

		const footer = page.locator('footer');
		await expect(footer).toBeVisible();

		// Footer contains the "No Copyright" external link
		await expect(
			footer.getByRole('link', { name: /No Copyright/i })
		).toBeVisible();

		// Footer nav links: 4 from NavLinks (Home, About me, Blog, Uses)
		// plus 1 "No Copyright" = 5 total (Projects link removed)
		const footerLinks = footer.getByRole('link');
		await expect(footerLinks).toHaveCount(5);
	});
});
