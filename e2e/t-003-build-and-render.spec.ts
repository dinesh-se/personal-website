import { expect, test } from '@playwright/test';

test.describe('T-003 — Build Clean & All Pages Render Without Runtime Errors', () => {
	/**
	 * GIVEN: The dev server is running (build exited with code 0, zero TypeScript errors)
	 * WHEN: I visit each page
	 * THEN: Each page loads without console errors
	 */
	test('all 5 pages load without runtime/console errors', async ({ page }) => {
		const errors: string[] = [];
		const warnings: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
				errors.push(msg.text());
			}
			if (msg.type() === 'warning') warnings.push(msg.text());
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
			await expect(page.locator('h1')).toContainText(title);
		}

		expect(errors).toEqual([]);
		expect(warnings).toEqual([]);
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I navigate through all pages via header navigation
	 * THEN: Navigation works without console errors at every step
	 */
	test('full navigation chain produces zero console errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await expect(page.locator('h1')).toContainText('Dinesh Haribabu');

		const nav = page.getByRole('navigation');

		await nav.getByRole('link', { name: 'About me' }).click();
		await expect(page).toHaveURL('/about');
		await expect(page.locator('h1')).toContainText(/about me/i);

		await nav.getByRole('link', { name: 'Projects' }).first().click();
		await expect(page).toHaveURL('/projects');
		await expect(page.locator('h1')).toContainText(/GitHub Projects/i);

		await nav.getByRole('link', { name: 'Blog' }).first().click();
		await expect(page).toHaveURL('/blog');
		await expect(page.locator('h1')).toContainText(/Blog Posts/i);

		await nav.getByRole('link', { name: 'Uses' }).first().click();
		await expect(page).toHaveURL('/uses');
		await expect(page.locator('h1')).toContainText(/Uses/i);

		// Navigate back through the chain
		await nav.getByRole('link', { name: 'About me' }).first().click();
		await expect(page).toHaveURL('/about');

		expect(errors).toEqual([]);
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit each page and check for structural elements
	 * THEN: Each page renders its expected content (no silent failures from type issues)
	 */
	test('each page renders expected structural content', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toContainText('Dinesh Haribabu');
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();

		await page.goto('/about');
		await expect(page.locator('h1')).toContainText(/about me/i);
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
		// Tech stack section (h2) should be present
		await expect(page.locator('h2')).toContainText(/technologies/i);

		await page.goto('/projects');
		await expect(page.locator('h1')).toContainText(/GitHub Projects/i);
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();

		await page.goto('/blog');
		await expect(page.locator('h1')).toContainText(/Blog Posts/i);
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();

		await page.goto('/uses');
		await expect(page.locator('h1')).toContainText(/Uses/i);
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
		// Intro link to Wes Bos's Uses.Tech
		await expect(
			page.getByRole('link', { name: "Wes Bos's Uses.Tech" })
		).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit the about page
	 * THEN: Social icon links render (verifying react-social-icons + React 19 compatibility)
	 */
	test('about page social icons render (React 19 PropTypes compatibility)', async ({
		page,
	}) => {
		await page.goto('/about');

		await expect(page.getByRole('link', { name: 'linkedin' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'github' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'email' })).toBeVisible();
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
	 * WHEN: I visit the uses page with data from fixtures
	 * THEN: Uses categories and items render (verifying graphql-request + Next.js 16 compatibility)
	 */
	test('uses page renders graphql data categories and items', async ({ page }) => {
		await page.goto('/uses');

		await expect(page.locator('h1')).toContainText(/Uses/i);
		await expect(page.locator('h2')).toContainText(/Development/i);
		await expect(page.getByText('VS Code')).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit the blog page with data from fixtures
	 * THEN: Blog post cards render (verifying dev.to API fetch + Next.js 16 compatibility)
	 */
	test('blog page renders dev.to data as post cards', async ({ page }) => {
		await page.goto('/blog');

		await expect(page.locator('h1')).toContainText(/Blog Posts/i);
		await expect(
			page.getByRole('link', { name: /Building Modern Web Apps/i })
		).toBeVisible();
	});

	/**
	 * GIVEN: The dev server is running
	 * WHEN: I visit the projects page with data from fixtures
	 * THEN: Project cards render with repo links (verifying graphql-request + Next.js 16 compatibility)
	 */
	test('projects page renders project cards with repo links', async ({ page }) => {
		await page.goto('/projects');

		await expect(page.locator('h1')).toContainText(/GitHub Projects/i);

		const projectLinks = page.locator('a[href*="github"]');
		await expect(projectLinks.first()).toBeVisible();
	});
});
