import { expect, test } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
	test('skip navigation link is visible on Tab', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const skipLink = page.getByRole('link', { name: /skip to main content/i });
		await expect(skipLink).toBeVisible();
	});

	test('all pages are keyboard accessible', async ({ page }) => {
		const pages = ['/', '/about', '/projects', '/blog', '/uses'];
		for (const path of pages) {
			await page.goto(path);
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await expect(page.locator(':focus')).toBeVisible();
		}
	});
});
