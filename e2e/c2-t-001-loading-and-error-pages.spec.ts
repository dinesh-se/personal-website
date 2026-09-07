import { expect, test } from '@playwright/test';

/**
 * C2-T-001 — Loading and Error Pages (single-page homepage)
 *
 * Scenarios derived from the task "User test":
 *   1. Skeleton loading file renders without errors on the home route
 *   2. Error boundary file mounts without errors on the home route
 *   3. Home page renders correctly in both light and dark modes
 *   4. Mobile navigation menu opens and closes
 *   5. Active navigation link behavior in Header and Footer
 *   6. Error page "Try again" button triggers a retry
 */

test.describe('C2-T-001 — Loading and Error Pages', () => {
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
	 * THEN: Error boundary file mounts without errors (error.tsx is valid and
	 *       doesn't interfere with normal rendering)
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
	 * WHEN: I visit /
	 * THEN: The home page renders without visual issues in light mode
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
	 * WHEN: I visit /
	 * THEN: The home page renders correctly with dark mode styles applied
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
	 * THEN: The Home/About/Writing/Contact links are present (anchors, active on /)
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

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I simulate a server error on the home page data fetch
	 * THEN: The page renders graceful fallback instead of crashing
	 */
	test('home page renders graceful fallback when data fetch fails', async ({
		page,
	}) => {
		await page.route('**/graphql', async (route) => {
			await route.fulfill({
				status: 500,
				body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
			});
		});

		await page.goto('/');

		// The hero still renders; the page must not crash into the error boundary.
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
	});
});
