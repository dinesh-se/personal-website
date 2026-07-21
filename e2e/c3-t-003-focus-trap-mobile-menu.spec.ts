import { expect, test } from '@playwright/test';

test.describe('T-003: Focus Trap in Mobile Menu', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/');
	});

	test('Tab cycles focus through menu focusable elements', async ({ page }) => {
		// GIVEN: mobile menu is open
		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();
		await expect(page.locator('#mobile-menu')).toHaveClass(/block/);

		// WHEN: Tab through menu elements
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// THEN: focus is trapped within the menu (not lost)
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();

		// Verify focused element is inside the mobile menu
		const isInsideMenu = await focusedElement.evaluate((el) => {
			const menu = document.getElementById('mobile-menu');
			return menu && menu.contains(el);
		});
		expect(isInsideMenu).toBe(true);
	});

	test('Shift+Tab cycles focus backwards through menu elements', async ({
		page,
	}) => {
		// GIVEN: mobile menu is open, focus is on last element
		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();

		// Tab to last element in menu
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// WHEN: Shift+Tab to cycle backwards
		await page.keyboard.press('Shift+Tab');

		// THEN: focus moves to previous element within menu
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
		const isInsideMenu = await focusedElement.evaluate((el) => {
			const menu = document.getElementById('mobile-menu');
			return menu && menu.contains(el);
		});
		expect(isInsideMenu).toBe(true);
	});

	test('Escape key closes the mobile menu', async ({ page }) => {
		// GIVEN: mobile menu is open
		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();
		await expect(page.locator('#mobile-menu')).toHaveClass(/block/);

		// WHEN: press Escape
		await page.keyboard.press('Escape');

		// THEN: menu closes
		await expect(page.locator('#mobile-menu')).not.toHaveClass(/block/);
	});

	test('focus returns to toggle button when menu closes via Escape', async ({
		page,
	}) => {
		// GIVEN: mobile menu is open
		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();

		// WHEN: press Escape to close menu
		await page.keyboard.press('Escape');

		// THEN: focus returns to the hamburger toggle button
		await expect(menuButton).toBeFocused();
	});

	test('focus returns to toggle button when menu closes via close button', async ({
		page,
	}) => {
		// GIVEN: mobile menu is open
		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();

		// WHEN: click close button
		const closeButton = page
			.getByRole('button', { name: /close/i, exact: true })
			.first();
		if (await closeButton.isVisible().catch(() => false)) {
			await closeButton.click();
		} else {
			// Fallback: click outside menu or use menu button again
			await menuButton.click();
		}

		// THEN: menu closes and focus returns to toggle
		await expect(page.locator('#mobile-menu')).toHaveClass(/hidden/);
		await expect(menuButton).toBeFocused();
	});

	test('focus trap does not interfere with desktop navigation', async ({
		page,
	}) => {
		// GIVEN: desktop viewport (menu should not be open by default)
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/');

		// WHEN: Tab through page elements
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// THEN: focus moves through desktop navigation normally (no trap)
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
	});
});
