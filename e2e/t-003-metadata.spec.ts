import { expect, test } from '@playwright/test';

test.describe('T-003 — Page Metadata via generateMetadata', () => {
	test('home page has correct title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Dinesh Haribabu');
	});

	test('robots.txt is served correctly', async ({ page }) => {
		const response = await page.goto('/robots.txt');
		expect(response?.status()).toBe(200);
		const content = (await response?.text()) ?? '';
		expect(content).toContain('User-Agent');
		expect(content).toContain('Allow');
		expect(content).toContain('/');
		expect(content).toContain('Sitemap: https://dineshharibabu.in/sitemap.xml');
	});

	test('sitemap.xml lists only the home route', async ({ page }) => {
		const response = await page.goto('/sitemap.xml');
		expect(response?.status()).toBe(200);
		// Read the raw XML via response.text() — page.content() returns the
		// browser's XML-viewer HTML wrapper, not the sitemap body.
		const content = (await response?.text()) ?? '';
		// The single-page homepage exposes exactly one URL
		expect(content).toContain('https://dineshharibabu.in');
		expect(content).not.toContain('/about');
		expect(content).not.toContain('/blog');
		expect(content).not.toContain('/uses');
	});
});
