import { expect, test } from '@playwright/test';

test.describe('Focus Management', () => {
	test('focus indicators are visible', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const focusedElement = page.locator(':focus');
		const focusStyle = await focusedElement.evaluate(el => {
			const style = getComputedStyle(el);
			return style.outline || style.boxShadow || '';
		});
		expect(focusStyle.length).toBeGreaterThan(0);
	});

	test('mobile menu traps focus', async ({ page }) => {
		await page.goto('/');
		await page.setViewportSize({ width: 375, height: 667 });
		await page.reload();
		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
	});

	test('focus returns to toggle on menu close', async ({ page }) => {
		await page.goto('/');
		await page.setViewportSize({ width: 375, height: 667 });
		await page.reload();
		const menuButton = page.getByRole('button', { name: /open main menu/i });
		await menuButton.click();
		await page.keyboard.press('Escape');
		await expect(menuButton).toBeFocused();
	});
});
