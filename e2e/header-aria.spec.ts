import { expect, test } from '@playwright/test';

test.describe('Header ARIA Labels', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('dark mode toggle has aria-label "Toggle dark mode"', async ({
		page,
	}) => {
		const toggleButton = page.getByRole('button', { name: 'Toggle dark mode' });
		await expect(toggleButton).toBeVisible();
		await expect(toggleButton).toHaveAttribute(
			'aria-label',
			'Toggle dark mode'
		);
	});

	test('mobile menu toggle has aria-label "Open main menu" when closed', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.reload();

		const menuButton = page.getByRole('button', { name: 'Open main menu' });
		await expect(menuButton).toBeVisible();
		await expect(menuButton).toHaveAttribute('aria-label', 'Open main menu');
	});

	test('mobile menu toggle has aria-label "Close main menu" when open', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.reload();

		await page.getByRole('button', { name: 'Open main menu' }).click();

		const closeMenuButton = page.getByRole('button', {
			name: 'Close main menu',
		});
		await expect(closeMenuButton).toBeVisible();
		await expect(closeMenuButton).toHaveAttribute(
			'aria-label',
			'Close main menu'
		);
	});

	test('mobile menu toggle aria-label toggles between open and close states', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.reload();

		const menuButton = page.getByRole('button', { name: 'Open main menu' });
		await expect(menuButton).toHaveAttribute('aria-label', 'Open main menu');

		await menuButton.click();
		await expect(
			page.getByRole('button', { name: 'Close main menu' })
		).toHaveAttribute('aria-label', 'Close main menu');

		await page.getByRole('button', { name: 'Close main menu' }).click();
		await expect(
			page.getByRole('button', { name: 'Open main menu' })
		).toHaveAttribute('aria-label', 'Open main menu');
	});

	test('logo link has aria-label "Home page"', async ({ page }) => {
		const logoLink = page.getByRole('link', { name: 'Home page' });
		await expect(logoLink).toBeVisible();
		await expect(logoLink).toHaveAttribute('aria-label', 'Home page');
	});

	test('mobile menu container has aria-label "Main navigation"', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.reload();

		const menuContainer = page.locator('#mobile-menu');
		await expect(menuContainer).toHaveAttribute(
			'aria-label',
			'Main navigation'
		);
	});

	test('nav links have visible text content', async ({ page }) => {
		const headerNav = page.locator('nav.bg-gray-900');
		const expectedLinks = ['About me', 'Projects', 'Blog', 'Uses'];
		for (const label of expectedLinks) {
			const link = headerNav.getByRole('link', { name: label });
			await expect(link).toBeVisible();
			await expect(link).toHaveText(label);
		}
	});

	test('all header buttons are discoverable by role and name', async ({
		page,
	}) => {
		// Dark mode toggle
		await expect(
			page.getByRole('button', { name: 'Toggle dark mode' })
		).toBeVisible();
		await expect(page.getByRole('link', { name: 'Home page' })).toBeVisible();

		// Mobile menu toggle (only visible on small screens)
		await page.setViewportSize({ width: 375, height: 812 });
		await page.reload();
		await expect(
			page.getByRole('button', { name: 'Open main menu' })
		).toBeVisible();
	});
});
