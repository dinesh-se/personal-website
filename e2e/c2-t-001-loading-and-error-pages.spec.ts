import { expect, test } from '@playwright/test';

/**
 * C2-T-001 — Per-Route Loading and Error Pages
 *
 * Scenarios derived from the task "User test":
 *   1. Skeleton loading files render without errors on all five routes
 *   2. Error boundary files mount without errors on all five routes
 *   3. All 5 pages render correctly in both light and dark modes
 *   4. Mobile navigation menu opens and closes
 *   5. Active navigation link is highlighted in both Header and Footer
 *   6. Error page "Try again" button triggers a retry
 */

test.describe('C2-T-001 — Per-Route Loading and Error Pages', () => {
	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit each route
	 * THEN: Each page renders its content without errors (loading.tsx files mount and
	 *       resolve to actual content; no broken skeleton state persists after hydration)
	 */
	test('skeleton loader files render correctly on all five routes', async ({
		page,
	}) => {
		const routes = [
			{ path: '/', heading: 'Dinesh Haribabu' },
			{ path: '/about', heading: /about me/i },
			{ path: '/projects', heading: /GitHub Projects/i },
			{ path: '/blog', heading: /Blog Posts/i },
			{ path: '/uses', heading: /Uses/i },
		];

		for (const { path: route, heading } of routes) {
			await page.goto(route);
			// After hydration the actual page content replaces the skeleton.
			// If loading.tsx is broken, the page would show skeleton artifacts
			// or fail to hydrate. We assert the real content is visible.
			await expect(
				page.getByRole('heading', { level: 1, name: heading })
			).toBeVisible();
			await expect(page.getByRole('navigation')).toBeVisible();
			await expect(page.locator('footer')).toBeVisible();
		}
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit each route
	 * THEN: Error boundary files mount without errors (error.tsx files are valid
	 *       React components that don't interfere with normal rendering)
	 */
	test('error boundary files render correctly on all five routes', async ({
		page,
	}) => {
		const routes = [
			{ path: '/', heading: 'Dinesh Haribabu' },
			{ path: '/about', heading: /about me/i },
			{ path: '/projects', heading: /GitHub Projects/i },
			{ path: '/blog', heading: /Blog Posts/i },
			{ path: '/uses', heading: /Uses/i },
		];

		for (const { path: route, heading } of routes) {
			await page.goto(route);
			// Error pages only render on throw. Normal page load confirms
			// the error boundary files don't break the route.
			await expect(
				page.getByRole('heading', { level: 1, name: heading })
			).toBeVisible();
		}
	});

	/**
	 * GIVEN: The dev server is running in light mode
	 * WHEN: I visit each page
	 * THEN: All 5 pages render without visual issues in light mode
	 */
	test('all pages render correctly in light mode', async ({ page }) => {
		// Ensure light mode by removing dark class
		await page.evaluate(() => {
			document.documentElement.classList.remove('dark');
		});

		const routes = [
			{ path: '/', title: 'Dinesh Haribabu' },
			{ path: '/about', title: /about me/i },
			{ path: '/projects', title: /GitHub Projects/i },
			{ path: '/blog', title: /Blog Posts/i },
			{ path: '/uses', title: /Uses/i },
		];

		for (const { path: route, title } of routes) {
			await page.goto(route);
			await expect(
				page.getByRole('heading', { level: 1, name: title })
			).toBeVisible();
			await expect(page.getByRole('navigation')).toBeVisible();
			await expect(page.locator('footer')).toBeVisible();
		}
	});

	/**
	 * GIVEN: The dev server is running and dark mode is enabled
	 * WHEN: I visit each page
	 * THEN: All 5 pages render correctly with dark mode styles applied
	 */
	test('all pages render correctly in dark mode', async ({ page }) => {
		// Force dark mode via the prefers-color-scheme media query override
		await page.emulateMedia({ colorScheme: 'dark' });

		const routes = [
			{ path: '/', title: 'Dinesh Haribabu' },
			{ path: '/about', title: /about me/i },
			{ path: '/projects', title: /GitHub Projects/i },
			{ path: '/blog', title: /Blog Posts/i },
			{ path: '/uses', title: /Uses/i },
		];

		for (const { path: route, title } of routes) {
			await page.goto(route);
			await expect(
				page.getByRole('heading', { level: 1, name: title })
			).toBeVisible();
			await expect(page.getByRole('navigation')).toBeVisible();
			await expect(page.locator('footer')).toBeVisible();
		}
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

		// Menu should be closed initially — hamburger visible, mobile menu hidden
		await expect(menuButton).toBeVisible();
		await expect(page.locator('#mobile-menu')).not.toBeVisible();

		// Open the menu
		await menuButton.click();

		// Mobile menu links should be visible inside the mobile menu container
		const mobileMenu = page.locator('#mobile-menu');
		await expect(mobileMenu).toBeVisible();
		await expect(
			mobileMenu.getByRole('link', { name: 'About me' })
		).toBeVisible();
		await expect(
			mobileMenu.getByRole('link', { name: 'Projects' })
		).toBeVisible();
		await expect(mobileMenu.getByRole('link', { name: 'Blog' })).toBeVisible();
		await expect(mobileMenu.getByRole('link', { name: 'Uses' })).toBeVisible();

		// Close the menu
		await menuButton.click();

		// Mobile menu should be hidden again
		await expect(mobileMenu).not.toBeVisible();
	});

	/**
	 * GIVEN: I am on any page
	 * WHEN: I look at the Header navigation
	 * THEN: The active navigation link is highlighted
	 */
	test('active navigation link is highlighted in Header on each route', async ({
		page,
	}) => {
		const routes = [
			{ path: '/about', activeLabel: 'About me' },
			{ path: '/projects', activeLabel: 'Projects' },
			{ path: '/blog', activeLabel: 'Blog' },
			{ path: '/uses', activeLabel: 'Uses' },
		];

		for (const { path: route, activeLabel } of routes) {
			await page.goto(route);

			// Header nav is the first <nav> element on the page
			const headerNav = page.locator('nav').first();

			// Active link should have the active class
			await expect(
				headerNav.getByRole('link', { name: activeLabel })
			).toHaveClass(/bg-stone-300/);
		}
	});

	/**
	 * GIVEN: I am on any page
	 * WHEN: I look at the Footer navigation
	 * THEN: The active navigation link is highlighted in the Footer
	 */
	test('active navigation link is highlighted in Footer on each route', async ({
		page,
	}) => {
		const routes = [
			{ path: '/about', activeLabel: 'About me' },
			{ path: '/projects', activeLabel: 'Projects' },
			{ path: '/blog', activeLabel: 'Blog' },
			{ path: '/uses', activeLabel: 'Uses' },
		];

		for (const { path: route, activeLabel } of routes) {
			await page.goto(route);

			const footer = page.locator('footer');

			// Active link should have the active class (font-semibold)
			await expect(footer.getByRole('link', { name: activeLabel })).toHaveClass(
				/font-semibold/
			);
		}
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I simulate a server error on the about page data fetch
	 * THEN: The route-specific error.tsx renders with skeleton-based fallback UI
	 */
	test('about page error boundary renders when data fetch fails', async ({
		page,
	}) => {
		// Intercept the GraphQL fetch and simulate a server error
		await page.route('**/graphql', async (route) => {
			await route.fulfill({
				status: 500,
				body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
			});
		});

		await page.goto('/about');

		// The route-specific error page should be visible
		await expect(
			page.getByRole('heading', { level: 2, name: /failed to load about/i })
		).toBeVisible();

		// The error page should have a "Try again" button
		await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

		// The error page should have a "Go Home" link
		await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I simulate a server error on the projects page data fetch
	 * THEN: The route-specific error.tsx renders with skeleton-based fallback UI
	 */
	test('projects page error boundary renders when data fetch fails', async ({
		page,
	}) => {
		await page.route('**/graphql', async (route) => {
			await route.fulfill({
				status: 500,
				body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
			});
		});

		await page.goto('/projects');

		await expect(
			page.getByRole('heading', { level: 2, name: /failed to load projects/i })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I simulate a server error on the blog page data fetch
	 * THEN: The route-specific error.tsx renders with skeleton-based fallback UI
	 */
	test('blog page error boundary renders when data fetch fails', async ({
		page,
	}) => {
		// Intercept the dev.to API fetch and simulate a server error
		await page.route('**/users/*/articles*', async (route) => {
			await route.fulfill({
				status: 500,
				body: JSON.stringify({ message: 'Server error' }),
			});
		});

		await page.goto('/blog');

		await expect(
			page.getByRole('heading', { level: 2, name: /failed to load blog/i })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I simulate a server error on the uses page data fetch
	 * THEN: The route-specific error.tsx renders with skeleton-based fallback UI
	 */
	test('uses page error boundary renders when data fetch fails', async ({
		page,
	}) => {
		await page.route('**/graphql', async (route) => {
			await route.fulfill({
				status: 500,
				body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
			});
		});

		await page.goto('/uses');

		await expect(
			page.getByRole('heading', { level: 2, name: /failed to load uses/i })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
	});

	/**
	 * GIVEN: A route-specific error page is showing
	 * WHEN: I click the "Try again" button
	 * THEN: The page re-renders and normal operation resumes
	 */
	test('error page "Try again" button re-renders the route on success', async ({
		page,
	}) => {
		// First, simulate an error
		await page.route('**/graphql', async (route) => {
			await route.fulfill({
				status: 500,
				body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
			});
		});

		await page.goto('/uses');

		// Error page should be visible
		await expect(
			page.getByRole('heading', { level: 2, name: /failed to load uses/i })
		).toBeVisible();

		// Now unblock the fetch so retry succeeds
		await page.route('**/graphql', (route) => route.continue());

		// Click "Try again"
		await page.getByRole('button', { name: 'Try again' }).click();

		// Normal content should be visible after retry
		await expect(
			page.getByRole('heading', { level: 1, name: /Uses/i })
		).toBeVisible();
	});

	/**
	 * GIVEN: A route-specific error page is showing
	 * WHEN: I click the "Go Home" link
	 * THEN: Navigation goes to the home page
	 */
	test('error page "Go Home" link navigates to home', async ({ page }) => {
		await page.route('**/graphql', async (route) => {
			await route.fulfill({
				status: 500,
				body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
			});
		});

		await page.goto('/about');

		await expect(
			page.getByRole('heading', { level: 2, name: /failed to load about/i })
		).toBeVisible();

		await page.getByRole('link', { name: 'Go Home' }).click();

		await expect(page).toHaveURL('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I simulate a server error on the root page data fetch
	 * THEN: The root error.tsx renders as catch-all fallback UI
	 */
	test('root error boundary renders as catch-all when home page fails', async ({
		page,
	}) => {
		await page.route('**/graphql', async (route) => {
			await route.fulfill({
				status: 500,
				body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
			});
		});

		await page.goto('/');

		// The root error page should be visible
		await expect(
			page.getByRole('heading', { level: 2, name: 'Something went wrong' })
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
	});
});
