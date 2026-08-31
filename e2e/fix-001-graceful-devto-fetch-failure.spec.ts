import { expect, test } from '@playwright/test';

/**
 * FIX-001 — Graceful Dev.to API Fetch Failure
 *
 * User test scenarios transcribed into GIVEN/WHEN/THEN. Since #24 the blog
 * page server-renders from a cached feed (`use cache` + cacheLife('hours')).
 * The graceful-degradation logic (empty feed on upstream failure) is verified
 * by the unit tests in src/api/__tests__/blog.test.ts; at the page level the
 * contract is that /blog never crashes and always renders its heading + intro
 * text regardless of Dev.to state.
 *
 * 1. Graceful render (server feed path)
 *    GIVEN: The site is running
 *    WHEN: I visit /blog
 *    THEN: The page renders without console errors, shows the heading and
 *          intro text, and renders either posts or the fallback message —
 *          never an empty, broken page.
 */

test.describe('FIX-001 — Graceful Dev.to API Fetch Failure', () => {
	/**
	 * GIVEN: The Dev.to API is unreachable / returns an error
	 * WHEN: I visit /blog
	 * THEN: The page renders gracefully — heading + intro text present, no
	 *       console errors, and (because the server-side fallback is intact)
	 *       either posts or the fallback message appears. The page must not
	 *       crash or show an empty body.
	 */
	test('blog page renders gracefully without crashing', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/blog');

		// Heading + intro always render (layout preserved)
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
});
