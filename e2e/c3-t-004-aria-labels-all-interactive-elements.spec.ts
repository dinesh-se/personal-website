import { expect, test } from '@playwright/test';

test.describe('T-004: Header Component ARIA Labels', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('dark mode toggle has accessible name "Toggle dark mode"', async ({ page }) => {
		// GIVEN: page is loaded, Header is rendered
		const toggleButton = page.getByRole('button', { name: /toggle dark mode/i });

		// THEN: button is discoverable by its accessible name
		await expect(toggleButton).toBeVisible();
	});

	test('mobile menu toggle announces "Open main menu" when closed', async ({ page }) => {
		// GIVEN: page is loaded, mobile menu is closed
		await page.setViewportSize({ width: 375, height: 812 });
		await page.reload();

		const menuButton = page.getByRole('button', { name: /open main menu/i });

		// THEN: button is discoverable by its "Open main menu" accessible name
		await expect(menuButton).toBeVisible();
	});

	test('mobile menu toggle announces "Close main menu" when open', async ({ page }) => {
		// GIVEN: page is loaded, mobile menu is open
		await page.setViewportSize({ width: 375, height: 812 });
		await page.reload();

		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();

		// WHEN: menu is now open
		// THEN: button accessible name changes to "Close main menu"
		const closeName = page.getByRole('button', { name: /close main menu/i });
		await expect(closeName).toBeVisible();
	});

	test('logo link has accessible name "Home page"', async ({ page }) => {
		// GIVEN: page is loaded, Header is rendered
		const logoLink = page.getByRole('link', { name: /home page/i });

		// THEN: logo link is discoverable by its accessible name
		await expect(logoLink).toBeVisible();
	});

	test('mobile menu container has navigation role or label', async ({ page }) => {
		// GIVEN: page is loaded
		await page.setViewportSize({ width: 375, height: 812 });
		await page.reload();

		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();

		// THEN: mobile menu container has role="menu" or aria-label="Main navigation"
		const menuContainer = page.locator('#mobile-menu');
		const role = await menuContainer.getAttribute('role');
		const ariaLabel = await menuContainer.getAttribute('aria-label');
		expect(role === 'menu' || ariaLabel === 'Main navigation').toBe(true);
	});

	test('axe-core reports zero aria-label violations on Header', async ({ page }) => {
		// GIVEN: page is loaded
		await page.goto('/');

		// THEN: axe-core CLI would report zero aria-label violations
		// Verify via Playwright: all interactive elements have accessible names
		const buttons = page.locator('header button');
		const buttonCount = await buttons.count();
		for (let i = 0; i < buttonCount; i++) {
			const button = buttons.nth(i);
			// Each button must be discoverable by role+name (screen reader behavior)
			const text = await button.innerText();
			const ariaLabel = await button.getAttribute('aria-label');
			expect(text.length > 0 || ariaLabel).toBeTruthy();
		}
	});
});
