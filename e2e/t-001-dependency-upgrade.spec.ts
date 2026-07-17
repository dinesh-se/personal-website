import { expect, test } from '@playwright/test';

test.describe('T-001 — Dependency Upgrade: All Pages Render', () => {
	test('should render home page without runtime errors', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toContainText('Dinesh Haribabu');
		await expect(page.getByText(/Hello, I am/)).toBeVisible();
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should render about page without runtime errors', async ({ page }) => {
		await page.goto('/about');
		await expect(page.locator('h1')).toContainText(/about me/i);
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should render projects page without runtime errors', async ({ page }) => {
		await page.goto('/projects');
		await expect(page.locator('h1')).toContainText(/GitHub Projects/i);
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should render blog page without runtime errors', async ({ page }) => {
		await page.goto('/blog');
		await expect(page.locator('h1')).toContainText(/Blog Posts/i);
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should render uses page without runtime errors', async ({ page }) => {
		await page.goto('/uses');
		await expect(page.locator('h1')).toContainText(/Uses/i);
		await expect(page.getByRole('navigation')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should navigate between all pages without console errors', async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await page.getByRole('navigation').getByRole('link', { name: 'About me' }).click();
		await expect(page).toHaveURL('/about');
		await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).first().click();
		await expect(page).toHaveURL('/projects');
		await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
		await expect(page).toHaveURL('/blog');
		await page.getByRole('navigation').getByRole('link', { name: 'Uses' }).click();
		await expect(page).toHaveURL('/uses');

		expect(errors).toEqual([]);
	});
});
