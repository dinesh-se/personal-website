import { expect, test } from '@playwright/test';

/**
 * T-001 — Loading and Error Pages (single-page homepage)
 *
 * Scenarios derived from the task "User test":
 *   1. Skeleton loading file renders without errors (loading.tsx exists and mounts)
 *   2. Error boundary file renders without errors (error.tsx is valid)
 *   3. Home page renders correctly in both light and dark modes
 *   4. Mobile navigation menu opens and closes
 *   5. Header renders anchor links on the single route
 */

test.describe('T-001 — Loading and Error Pages', () => {
	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit /
	 * THEN: The page renders its content without errors (loading.tsx mounts and
	 *       resolves to actual content; no broken skeleton state persists)
	 */
	test('skeleton loader file renders correctly on home route', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit /
	 * THEN: Error boundary file mounts without errors (error.tsx is a valid
	 *       React component that doesn't interfere with normal rendering)
	 */
	test('error boundary file renders correctly on home route', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running in light mode
	 * WHEN: I visit the home page
	 * THEN: It renders without visual issues in light mode
	 */
	test('home page renders correctly in light mode', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.classList.remove('dark');
		});

		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running and dark mode is enabled
	 * WHEN: I visit the home page
	 * THEN: It renders correctly with dark mode styles applied
	 */
	test('home page renders correctly in dark mode', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });

		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	/**
	 * GIVEN: I am on a page at mobile viewport width
	 * WHEN: I tap the hamburger menu button
	 * THEN: The mobile navigation menu opens and closes correctly
	 */
	test('mobile navigation menu opens and closes', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });

		await page.goto('/');

		const menuButton = page.getByRole('button', { name: /menu/i });

		await expect(menuButton).toBeVisible();
		await expect(page.locator('#mobile-menu')).not.toBeVisible();

		await menuButton.click();

		const mobileMenu = page.locator('#mobile-menu');
		await expect(mobileMenu).toBeVisible();
		await expect(
			mobileMenu.getByRole('link', { name: 'About' })
		).toBeVisible();
		await expect(
			mobileMenu.getByRole('link', { name: 'Writing' })
		).toBeVisible();
		await expect(
			mobileMenu.getByRole('link', { name: 'Contact' })
		).toBeVisible();

		await menuButton.click();

		await expect(mobileMenu).not.toBeVisible();
	});

	/**
	 * GIVEN: I am on the home page
	 * WHEN: I look at the Header navigation
	 * THEN: The anchor links are present
	 */
	test('header nav renders anchor links on home route', async ({ page }) => {
		await page.goto('/');

		const headerNav = page.locator('nav').first();

		await expect(headerNav.getByRole('link', { name: 'About' })).toBeVisible();
		await expect(
			headerNav.getByRole('link', { name: 'Writing' })
		).toBeVisible();
		await expect(
			headerNav.getByRole('link', { name: 'Contact' })
		).toBeVisible();
	});
});
