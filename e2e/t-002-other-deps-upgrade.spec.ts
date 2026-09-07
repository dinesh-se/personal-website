import { expect, test } from '@playwright/test';

test.describe('T-002 — Upgrade All Other Direct Dependencies', () => {
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

	test('home page renders without crashes after dependency upgrade', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	test('removed routes (about/blog/uses) return 404', async ({ page }) => {
		for (const path of ['/about', '/blog', '/uses']) {
			const response = await page.goto(path);
			expect(response?.status()).toBe(404);
		}
	});

	test('blog section renders content from dev.to API fetch', async ({
		page,
	}) => {
		await page.goto('/');

		await expect(page.locator('#writing')).toBeVisible();

		// Blog post cards render from live Dev.to data. Post titles are
		// content-managed, so assert that at least one post card (a link to
		// dev.to) renders rather than a fixture-specific title.
		await expect(page.locator('#writing a[href*="dev.to"]').first()).toBeVisible();
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

		// Footer nav links: 4 from NavLinks (Home, About, Writing, Contact)
		// plus 1 "No Copyright" = 5 total (removed routes gone)
		const footerLinks = footer.getByRole('link');
		await expect(footerLinks).toHaveCount(5);
	});
});
