import { expect, test } from '@playwright/test';

test.describe('Home Page — e2e smoke', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should render the page title', async ({ page }) => {
		await expect(page).toHaveTitle(/Dinesh Haribabu/);
	});

	test('should display the greeting', async ({ page }) => {
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();
	});

	test('should render the header navigation', async ({ page }) => {
		await expect(page.locator('nav')).toBeVisible();
		const nav = page.getByRole('navigation');
		await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Writing' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
	});

	test('should render the footer', async ({ page }) => {
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should scroll to About section via anchor', async ({ page }) => {
		await page
			.getByRole('navigation')
			.getByRole('link', { name: 'About' })
			.first()
			.click();
		await expect(page.locator('#about')).toBeInViewport();
	});

	test('should scroll to Writing section via anchor', async ({ page }) => {
		await page
			.getByRole('navigation')
			.getByRole('link', { name: 'Writing' })
			.first()
			.click();
		await expect(page.locator('#writing')).toBeInViewport();
	});

	test('should scroll to Contact section via anchor', async ({ page }) => {
		await page
			.getByRole('navigation')
			.getByRole('link', { name: 'Contact' })
			.first()
			.click();
		await expect(page.locator('#contact')).toBeInViewport();
	});
});

test.describe('Mobile Menu', () => {
	test('should toggle mobile menu', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/');
		await page.waitForSelector('#mobile-menu', { state: 'attached' });

		const menuButton = page.getByRole('button', { name: /menu/i });
		await expect(menuButton).toBeVisible();

		await expect(page.locator('#mobile-menu')).toHaveClass(/hidden/);

		await menuButton.click();
		await expect(page.locator('#mobile-menu')).not.toHaveClass(
			/(^|\s)hidden(\s|$)/
		);

		await menuButton.click();
		await expect(page.locator('#mobile-menu')).toHaveClass(
			/(^|\s)hidden(\s|$)/
		);
	});
});

test.describe('Dark Mode', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
	});

	test('should respect system preference', async ({ page }) => {
		await page.goto('/');

		const body = page.locator('body');
		await expect(body).toBeVisible();

		await page.emulateMedia({ colorScheme: 'dark' });
		await page.reload();

		const foregroundColor = await page.evaluate(() =>
			getComputedStyle(document.documentElement)
				.getPropertyValue('--foreground-rgb')
				.trim()
		);
		expect(foregroundColor).toBe('#ffffff');
	});
});

test.describe('Footer Links', () => {
	test('should have footer navigation links', async ({ page }) => {
		await page.goto('/');

		const footer = page.locator('footer');
		await expect(footer).toBeVisible();

		await expect(
			footer.getByRole('link', { name: /No Copyright/i })
		).toBeVisible();
	});
});
