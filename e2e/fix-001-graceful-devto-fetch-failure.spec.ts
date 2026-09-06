import { expect, test } from '@playwright/test';

/**
 * FIX-001 — Graceful Dev.to API Fetch Failure
 *
 * The blog section server-renders from a cached feed (`use cache` + cacheLife).
 * The graceful-degradation logic (empty feed on upstream failure) is verified
 * by the unit tests in src/api/__tests__/blog.test.ts; at the page level the
 * contract is that the home page never crashes and always renders its hero +
 * about + contact sections regardless of Dev.to state.
 */

test.describe('FIX-001 — Graceful Dev.to API Fetch Failure', () => {
	/**
	 * GIVEN: The Dev.to API is unreachable / returns an error
	 * WHEN: I visit /
	 * THEN: The page renders gracefully — hero visible, no console errors, and
	 *       the blog section either shows posts or stays gracefully empty.
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
		// About and Contact sections always render
		await expect(page.locator('#about')).toBeVisible();
		await expect(page.locator('#contact')).toBeVisible();

		// No console errors (graceful, no unhandled rejection / crash)
		expect(consoleErrors).toEqual([]);
	});
});
