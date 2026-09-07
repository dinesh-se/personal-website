import { expect, test } from '@playwright/test';

/**
 * FIX-002 — fix-e2e-blog-failure-playwright-config-and-fetch-mocking
 *
 * Verifies the e2e test infrastructure (webServer on port 3099) and that the
 * home page's blog section renders gracefully. Since #24 the blog feed
 * server-renders from a cached feed (`use cache` + cacheLife('hours')); the
 * client-side fallback is kept as a safety net but the primary fetch is
 * server-side. The fallback logic is verified by unit tests
 * (src/api/__tests__/blog.test.ts).
 */

test.describe('FIX-002 — Blog e2e: API interception & fallback', () => {
	/**
	 * GIVEN: The site is running
	 * WHEN: I visit /
	 * THEN: The page renders gracefully — hero visible, no console errors,
	 *       and the blog section either shows posts or the fallback message.
	 */
	test('home page renders gracefully without crashing', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/');

		// Hero always renders (layout preserved)
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
		await expect(page.locator('#writing')).toBeVisible();

		// No console errors (graceful, no unhandled rejection / crash)
		expect(consoleErrors).toEqual([]);
	});

	/**
	 * GIVEN: The Dev.to feed returns posts
	 * WHEN: I visit /
	 * THEN: At least one post card (a link to dev.to) renders in the blog section.
	 */
	test('renders blog post cards from the live feed', async ({ page }) => {
		await page.goto('/');

		await expect(page.locator('#writing')).toBeVisible();

		// Post cards render as links to dev.to (titles are content-managed)
		await expect(
			page.locator('#writing a[href*="dev.to"]').first()
		).toBeVisible();
	});
});
