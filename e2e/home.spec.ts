import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should render the page title', async ({ page }) => {
		await expect(page).toHaveTitle(/Dinesh Haribabu/);
	});

	test('should display the greeting', async ({ page }) => {
		await expect(page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })).toBeVisible();
	});

	test('should render the header navigation', async ({ page }) => {
		await expect(page.locator('nav')).toBeVisible();
		const nav = page.getByRole('navigation');
		await expect(nav.getByRole('link', { name: 'About me' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Blog' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Uses' })).toBeVisible();
	});

	test('should render the footer', async ({ page }) => {
		await expect(page.locator('footer')).toBeVisible();
	});

	test('should navigate to about page', async ({ page }) => {
		await page.getByRole('navigation').getByRole('link', { name: 'About me' }).click();
		await expect(page).toHaveURL('/about');
		await expect(page.getByRole('heading', { level: 1, name: /about me/i })).toBeVisible();
	});

	test('should navigate to projects page', async ({ page }) => {
		await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click();
		await expect(page).toHaveURL('/projects');
	});

	test('should navigate to blog page', async ({ page }) => {
		await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
		await expect(page).toHaveURL('/blog');
	});

	test('should navigate to uses page', async ({ page }) => {
		await page.getByRole('navigation').getByRole('link', { name: 'Uses' }).click();
		await expect(page).toHaveURL('/uses');
	});
});

test.describe('Mobile Menu', () => {
	test('should toggle mobile menu', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/');
		await page.waitForSelector('#mobile-menu', { state: 'attached' });

		const menuButton = page.getByRole('button', { name: /menu/i });
		await expect(menuButton).toBeVisible();

		// Menu should be closed initially (hidden class present)
		await expect(page.locator('#mobile-menu')).toHaveClass(/hidden/);

		// Open menu
		await menuButton.click();
		await expect(page.locator('#mobile-menu')).not.toHaveClass(/(^|\s)hidden(\s|$)/);

		// Close menu
		await menuButton.click();
		await expect(page.locator('#mobile-menu')).toHaveClass(/(^|\s)hidden(\s|$)/);
	});
});

test.describe('Dark Mode', () => {
	test('should respect system preference', async ({ page }) => {
		await page.goto('/');

		// Verify page renders in light mode
		const body = page.locator('body');
		await expect(body).toBeVisible();

		// Emulate dark mode system preference
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.reload();

		// Verify dark mode CSS custom properties are applied
		// --foreground-rgb switches to #ffffff in dark mode (defined in globals.css media query)
		const foregroundColor = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--foreground-rgb').trim()
		);
		expect(foregroundColor).toBe('#ffffff');
	});
});

test.describe('Footer Links', () => {
	test('should have footer navigation links', async ({ page }) => {
		await page.goto('/');

		const footer = page.locator('footer');
		await expect(footer).toBeVisible();

		// Check for No Copyright link
		await expect(footer.getByRole('link', { name: /No Copyright/i })).toBeVisible();
	});
});

test.describe('Nav Active State', () => {
	test('should show active state on current navigation link', async ({ page }) => {
		await page.goto('/about');

		// Navigate to the nav
		const nav = page.getByRole('navigation');

		// 'About me' link should have active state class (bg-stone-300)
		const aboutLink = nav.getByRole('link', { name: 'About me' });
		await expect(aboutLink).toHaveClass(/bg-stone-300/);

		// Other links should NOT have active state class
		const projectsLink = nav.getByRole('link', { name: 'Projects' });
		await expect(projectsLink).not.toHaveClass(/bg-stone-300/);

		const blogLink = nav.getByRole('link', { name: 'Blog' });
		await expect(blogLink).not.toHaveClass(/bg-stone-300/);

		const usesLink = nav.getByRole('link', { name: 'Uses' });
		await expect(usesLink).not.toHaveClass(/bg-stone-300/);
	});
});
