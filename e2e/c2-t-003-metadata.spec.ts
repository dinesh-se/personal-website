import { expect, test } from '@playwright/test';

/**
 * C2-T-003 — generateMetadata Migration (single-page homepage)
 *
 * Scenarios derived from the task "User test":
 *   1. The single '/' page produces the correct title via generateMetadata
 *   2. robots.txt is served correctly at /robots.txt
 *   3. sitemap.xml is served correctly at /sitemap.xml (single '/' entry)
 *   4. Home page renders correctly in light mode
 *   5. Home page renders correctly in dark mode
 *   6. Mobile navigation menu opens and closes at mobile viewport width
 *   7. Anchor navigation works in the Header
 *   8. Anchor navigation works in the Footer
 */

test.describe('C2-T-003 — generateMetadata Migration', () => {
	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit /
	 * THEN: The page's <title> matches the generateMetadata title
	 */
	test('home page has correct generateMetadata title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Dinesh Haribabu');
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I fetch /robots.txt
	 * THEN: The response is 200 with valid robots.txt content
	 */
	test('robots.txt is served correctly', async ({ page }) => {
		const response = await page.goto('/robots.txt');
		expect(response?.status()).toBe(200);
		const content = (await response?.text()) ?? '';
		expect(content).toContain('User-Agent');
		expect(content).toContain('Allow');
		expect(content).toContain('/');
		expect(content).toContain('Sitemap: https://dineshharibabu.in/sitemap.xml');
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I fetch /sitemap.xml
	 * THEN: The response is 200 with a single '/' entry (no /about, /blog, /uses)
	 */
	test('sitemap.xml is served correctly', async ({ page }) => {
		const response = await page.goto('/sitemap.xml');
		expect(response?.status()).toBe(200);
		// Read the raw XML via response.text() — page.content() returns the
		// browser's XML-viewer HTML wrapper, not the sitemap body.
		const content = (await response?.text()) ?? '';
		expect(content).toContain('https://dineshharibabu.in');
		// Removed routes must NOT appear in the sitemap
		expect(content).not.toContain('/about');
		expect(content).not.toContain('/blog');
		expect(content).not.toContain('/uses');
	});

	/**
	 * GIVEN: The dev server is running in light mode
	 * WHEN: I visit /
	 * THEN: The home page renders its content without errors in light mode
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
		await expect(
			mobileMenu.getByRole('link', { name: 'Projects' })
		).not.toBeVisible();

		await menuButton.click();

		await expect(mobileMenu).not.toBeVisible();
	});

	/**
	 * GIVEN: I am on the home page
	 * WHEN: I click a Header anchor link
	 * THEN: The page scrolls to the target section
	 */
	test('anchor navigation works in Header on home page', async ({ page }) => {
		await page.goto('/');

		const headerNav = page.locator('nav').first();

		await headerNav.getByRole('link', { name: 'About' }).click();
		await expect(page.locator('#about')).toBeInViewport();

		await headerNav.getByRole('link', { name: 'Writing' }).click();
		await expect(page.locator('#writing')).toBeInViewport();

		await headerNav.getByRole('link', { name: 'Contact' }).click();
		await expect(page.locator('#contact')).toBeInViewport();
	});

	/**
	 * GIVEN: I am on the home page
	 * WHEN: I click a Footer anchor link
	 * THEN: The page scrolls to the target section
	 */
	test('anchor navigation works in Footer on home page', async ({ page }) => {
		await page.goto('/');

		const footer = page.locator('footer');

		await footer.getByRole('link', { name: 'About' }).click();
		await expect(page.locator('#about')).toBeInViewport();
	});
});
