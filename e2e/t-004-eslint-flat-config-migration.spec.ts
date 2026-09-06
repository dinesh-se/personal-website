import { expect, test } from '@playwright/test';

test.describe('T-004 — ESLint v8 Flat Config Migration', () => {
	/**
	 * This task migrates ESLint from v8 (.eslintrc.json) to v9 flat config (eslint.config.mjs).
	 * No user-facing behavior changes — the app renders identically.
	 * The migration must not introduce runtime errors or break the page.
	 *
	 * GIVEN: ESLint has been migrated to v9 flat config (eslint.config.mjs exists, .eslintrc.json removed)
	 * WHEN: I visit the home page
	 * THEN: The page loads without console errors (migration did not break the app)
	 */
	test('home page loads without console errors after ESLint migration', async ({
		page,
	}) => {
		const errors: string[] = [];

		page.on('console', (msg) => {
			if (
				msg.type() === 'error' &&
				!msg.text().includes('Failed to load resource')
			) {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();

		expect(errors).toEqual([]);
	});

	/**
	 * GIVEN: ESLint flat config is in place (eslint.config.mjs exists)
	 * WHEN: I navigate via anchor links on the home page
	 * THEN: Navigation works without console errors (migration is transparent to the user)
	 */
	test('anchor navigation produces zero console errors after migration', async ({
		page,
	}) => {
		const errors: string[] = [];

		page.on('console', (msg) => {
			if (
				msg.type() === 'error' &&
				!msg.text().includes('Failed to load resource')
			) {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();

		const nav = page.getByRole('navigation');

		await nav.getByRole('link', { name: 'About' }).first().click();
		await expect(page.locator('#about')).toBeInViewport();

		await nav.getByRole('link', { name: 'Writing' }).first().click();
		await expect(page.locator('#writing')).toBeInViewport();

		await nav.getByRole('link', { name: 'Contact' }).first().click();
		await expect(page.locator('#contact')).toBeInViewport();

		expect(errors).toEqual([]);
	});
});
