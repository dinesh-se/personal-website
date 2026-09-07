import { expect, test } from '@playwright/test';

test.describe('T-001 — Dependency Upgrade: Home Page Renders', () => {
	test('should render home page without runtime errors', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
		await expect(page.getByText(/Hello, I am/)).toBeVisible();
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should render all home sections without runtime errors', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(page.locator('#about')).toBeVisible();
		await expect(page.locator('#writing')).toBeVisible();
		await expect(page.locator('#contact')).toBeVisible();
	});

	test('home page renders without console errors', async ({ page }) => {
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

	test('anchor navigation works without console errors', async ({ page }) => {
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
