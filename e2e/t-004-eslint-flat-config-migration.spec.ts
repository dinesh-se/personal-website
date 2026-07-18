import { expect, test } from '@playwright/test';

test.describe('T-004 — ESLint v8 Flat Config Migration', () => {
	/**
	 * This task migrates ESLint from v8 (.eslintrc.json) to v9 flat config (eslint.config.mjs).
	 * No user-facing behavior changes — the app renders identically.
	 * The migration must not introduce runtime errors or break any page.
	 *
	 * GIVEN: ESLint has been migrated to v9 flat config (eslint.config.mjs exists, .eslintrc.json removed)
	 * WHEN: I visit all pages
	 * THEN: All pages load without console errors (migration did not break the app)
	 */
	test('all pages load without console errors after ESLint migration', async ({
		page,
	}) => {
		const errors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
				errors.push(msg.text());
			}
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
	});

	/**
	 * GIVEN: ESLint flat config is in place (eslint.config.mjs exists)
	 * WHEN: I navigate through all pages via header navigation
	 * THEN: Navigation works without console errors (migration is transparent to the user)
	 */
	test('navigation chain produces zero console errors after migration', async ({
		page,
	}) => {
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

		expect(errors).toEqual([]);
	});
});
