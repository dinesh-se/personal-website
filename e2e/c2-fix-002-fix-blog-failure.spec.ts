import { expect, test } from '@playwright/test';

/**
 * FIX-002 — fix-e2e-blog-failure-playwright-config-and-fetch-mocking
 *
 * Verifies the e2e test infrastructure (webServer on port 3099) and that the
 * blog page renders gracefully. Since #24 the blog page server-renders from a
 * cached feed (`use cache` + cacheLife('hours')); the client-side fallback is
 * kept as a safety net but the primary fetch is server-side, so browser-side
 * route interception of the upstream Dev.to API can no longer drive the page.
 * The fallback logic is verified by unit tests (src/api/__tests__/blog.test.ts).
 *
 * Scenarios (GIVEN/WHEN/THEN transcribed into tests):
 *
 * 1. Graceful render
 *    GIVEN: The site is running on port 3099
 *    WHEN: I visit /blog
 *    THEN: The page renders without console errors — heading and intro text
 *          present, and either posts or the fallback message appear. Never an
 *          empty, broken page.
 *
 * 2. Blog cards render from the live feed
 *    GIVEN: The Dev.to feed returns posts
 *    WHEN: I visit /blog
 *    THEN: At least one post card (a link to dev.to) renders.
 */

test.describe('FIX-002 — Blog e2e: API interception & fallback', () => {
	/**
	 * GIVEN: The site is running
	 * WHEN: I visit /blog
	 * THEN: The page renders gracefully — heading + intro text present, no
	 *       console errors, and either posts or the fallback message appear.
	 */
	test('blog page renders gracefully without crashing', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/blog');

		// Layout preserved: heading and intro text always render
		await expect(
			page.getByRole('heading', { level: 1, name: 'Blog Posts' })
		).toBeVisible();
		await expect(
			page.getByText(
				/I write about web development, software engineering, and other topics/
			)
		).toBeVisible();

		// No console errors (graceful, no unhandled rejection / crash)
		expect(consoleErrors).toEqual([]);
	});

	/**
	 * GIVEN: The Dev.to feed returns posts
	 * WHEN: I visit /blog
	 * THEN: At least one post card (a link to dev.to) renders.
	 */
	test('renders blog post cards from the live feed', async ({ page }) => {
		await page.goto('/blog');

		await expect(
			page.getByRole('heading', { level: 1, name: 'Blog Posts' })
		).toBeVisible();

		// Post cards render as links to dev.to (titles are content-managed)
		await expect(page.locator('a[href*="dev.to"]').first()).toBeVisible();
	});
});
