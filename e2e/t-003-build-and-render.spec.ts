import { expect, test } from '@playwright/test';

test.describe('T-003 — Build Clean & Home Page Renders Without Runtime Errors', () => {
	/**
	 * GIVEN: The dev server is running (build exited with code 0, zero TypeScript errors)
	 * WHEN: I visit the home page
	 * THEN: The page loads without console errors
	 */
	test('home page loads without runtime/console errors', async ({ page }) => {
		const errors: string[] = [];
		const warnings: string[] = [];

		page.on('console', (msg) => {
			if (
				msg.type() === 'error' &&
				!msg.text().includes('Failed to load resource')
			) {
				errors.push(msg.text());
			}
			if (msg.type() === 'warning') warnings.push(msg.text());
		});

		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();

		expect(errors).toEqual([]);
		expect(warnings).toEqual([]);
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I navigate through the home page via header anchor links
	 * THEN: Navigation works without console errors at every step
	 */
	test('anchor navigation produces zero console errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (
				msg.type() === 'error' &&
				!msg.text().includes('Failed to load resource')
			) {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();

		const nav = page.getByRole('navigation');

		await nav.getByRole('link', { name: 'About' }).first().click();
		await expect(page.locator('#about')).toBeInViewport();

		await nav.getByRole('link', { name: 'Writing' }).first().click();
		await expect(page.locator('#writing')).toBeInViewport();

		await nav.getByRole('link', { name: 'Contact' }).first().click();
		await expect(page.locator('#contact')).toBeInViewport();

		expect(errors).toEqual([]);
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit the home page and check for structural elements
	 * THEN: Each section renders its expected content (no silent failures from type issues)
	 */
	test('home page renders expected structural content', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
		await expect(page.locator('#about')).toBeVisible();
		await expect(page.locator('#writing')).toBeVisible();
		await expect(page.locator('#contact')).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit the home page
	 * THEN: Contact component social icons render (verifying react-social-icons compatibility)
	 */
	test('home page contact icons render (React 19 PropTypes compatibility)', async ({
		page,
	}) => {
		await page.goto('/');

		await expect(page.getByRole('link', { name: 'linkedin' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'github' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'email' })).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit the home page
	 * THEN: Blog post cards render in the Writing section (verifying dev.to API fetch + Next.js 16 compatibility)
	 */
	test('blog section renders dev.to data as post cards', async ({ page }) => {
		await page.goto('/');

		await expect(page.locator('#writing')).toBeVisible();
		// Blog post cards render from live Dev.to data (content-managed, so
		// assert at least one dev.to link renders rather than fixture data).
		await expect(page.locator('#writing a[href*="dev.to"]').first()).toBeVisible();
	});
});
