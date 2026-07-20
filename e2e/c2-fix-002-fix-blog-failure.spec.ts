import { expect, test } from '@playwright/test';

/**
 * FIX-002 — fix-e2e-blog-failure-playwright-config-and-fetch-mocking
 *
 * Verifies the e2e test infrastructure (webServer on port 3099) and the
 * browser-side API interception pattern for the blog page.
 *
 * Scenarios (GIVEN/WHEN/THEN transcribed into tests):
 *
 * 1. Auth-failure fallback
 *    GIVEN: The local API route returns an auth error
 *    WHEN: I visit /blog
 *    THEN: The fallback message "Blog posts are temporarily unavailable.
 *          Check back soon." is visible, and the heading + intro text
 *          are still rendered (layout preserved).
 *
 * 2. Fetch success with mocked posts
 *    GIVEN: The local API route returns a successful response with posts
 *    WHEN: I visit /blog
 *    THEN: Blog post cards render with titles, descriptions, dates, and
 *          reaction/comment/view counts.
 */

test.describe('FIX-002 — Blog e2e: API interception & fallback', () => {
	/**
	 * GIVEN: The local API route returns an auth error (simulating invalid DEVTO_KEY)
	 * WHEN: I visit /blog
	 * THEN: The fallback message is visible, heading + intro text are preserved.
	 */
	test('shows fallback message when Dev.to API auth fails', async ({
		page,
	}) => {
		// Intercept the local API route and simulate an auth error response
		await page.route('**/api/articles/me/published*', async (route) => {
			await route.fulfill({
				status: 503,
				body: JSON.stringify({ success: false, errorType: 'auth' }),
			});
		});

		await page.goto('/blog');

		// Fallback message must be visible
		await expect(
			page.getByText('Blog posts are temporarily unavailable. Check back soon.')
		).toBeVisible();

		// Layout preserved: heading and intro text still render
		await expect(
			page.getByRole('heading', { level: 1, name: 'Blog Posts' })
		).toBeVisible();
		await expect(
			page.getByText(
				/I write about web development, software engineering, and other topics/
			)
		).toBeVisible();

		// No blog post cards should appear since the fetch failed
		await expect(
			page.getByText('Building Modern Web Apps with Next.js 16')
		).not.toBeVisible();
	});

	/**
	 * GIVEN: The local API route returns a successful response with mocked posts
	 * WHEN: I visit /blog
	 * THEN: Blog post cards render with titles, descriptions, dates, and
	 *       reaction/comment/view counts.
	 */
	test('renders blog posts normally when Dev.to API succeeds', async ({
		page,
	}) => {
		// Intercept the local API route (BlogContent fetches from here,
		// not directly from Dev.to). Mock the wrapped response format.
		await page.route('**/api/articles/me/published*', async (route) => {
			await route.fulfill({
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					success: true,
					posts: [
						{
							id: '99999',
							title: 'Test Post — FIX-002 Validation',
							description:
								'This post verifies that blog cards render correctly.',
							date: '2026-07-20T12:00:00.000Z',
							url: 'https://dev.to/dinesh-se/test-post-fix-002',
							commentsCount: 42,
							reactionsCount: 13,
							pageViewsCount: 999,
						},
					],
				}),
			});
		});

		await page.goto('/blog');

		// Post title visible
		await expect(
			page.getByText('Test Post — FIX-002 Validation')
		).toBeVisible();

		// Post description visible
		await expect(
			page.getByText('This post verifies that blog cards render correctly.')
		).toBeVisible();

		// Date formatted with en-IN locale (dd/MM/yyyy)
		await expect(page.getByText('20/7/2026')).toBeVisible();

		// Metadata (reactions, comments, views) visible
		await expect(page.getByText('13')).toBeVisible();
		await expect(page.getByText('42')).toBeVisible();
		await expect(page.getByText('999')).toBeVisible();

		// Link to the post is present
		await expect(
			page.getByRole('link', { name: 'Test Post — FIX-002 Validation' })
		).toHaveAttribute('href', 'https://dev.to/dinesh-se/test-post-fix-002');
	});
});
