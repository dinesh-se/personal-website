import { expect, test } from '@playwright/test';

test.describe('T-003 — Page Metadata via generateMetadata', () => {
	test('home page has correct title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Dinesh Haribabu');
	});

	test('about page has correct title', async ({ page }) => {
		await page.goto('/about');
		await expect(page).toHaveTitle('About me — Dinesh Haribabu');
	});

	test('projects page has correct title', async ({ page }) => {
		await page.goto('/projects');
		await expect(page).toHaveTitle('Projects — Dinesh Haribabu');
	});

	test('blog page has correct title', async ({ page }) => {
		await page.goto('/blog');
		await expect(page).toHaveTitle('Blog — Dinesh Haribabu');
	});

	test('uses page has correct title', async ({ page }) => {
		await page.goto('/uses');
		await expect(page).toHaveTitle('Uses — Dinesh Haribabu');
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

	test('sitemap.xml is served correctly', async ({ page }) => {
		const response = await page.goto('/sitemap.xml');
		expect(response?.status()).toBe(200);
		const content = await page.content();
		expect(content).toContain('https://dineshharibabu.in/');
		expect(content).toContain('/about');
		expect(content).toContain('/projects');
		expect(content).toContain('/blog');
		expect(content).toContain('/uses');
	});
});
