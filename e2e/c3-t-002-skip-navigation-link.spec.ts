import { expect, test } from '@playwright/test';

test.describe('T-002: Skip Navigation Link', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('skip navigation link is hidden by default', async ({ page }) => {
		// GIVEN: page is loaded, no interaction yet
		const skipLink = page.getByRole('link', { name: /skip to main content/i });

		// THEN: link is not visible on the page
		await expect(skipLink).toBeHidden();
	});

	test('skip navigation link becomes visible on first Tab press', async ({ page }) => {
		// GIVEN: page is loaded
		const skipLink = page.getByRole('link', { name: /skip to main content/i });

		// WHEN: press Tab on page load
		await page.keyboard.press('Tab');

		// THEN: verify a skip navigation link becomes visible
		await expect(skipLink).toBeVisible();
	});

	test('clicking the skip link jumps to the main content area', async ({ page }) => {
		// GIVEN: skip link is visible (Tab pressed)
		const skipLink = page.getByRole('link', { name: /skip to main content/i });
		await page.keyboard.press('Tab');

		// Scroll to top to ensure we're not already at main content
		await page.evaluate(() => window.scrollTo(0, 0));

		// WHEN: clicking the skip link
		await skipLink.click();

		// THEN: jumps to the main content area — main element is in viewport
		const mainContent = page.locator('main');
		await expect(mainContent).toBeVisible();
		const mainBox = await mainContent.boundingBox();
		expect(mainBox).not.toBeNull();
		if (mainBox) {
			expect(mainBox.y).toBeLessThan(200);
		}
	});

	test('skip link is hidden for mouse users and hover does not reveal it', async ({ page }) => {
		// GIVEN: page is loaded
		const skipLink = page.getByRole('link', { name: /skip to main content/i });

		// THEN: skip link remains hidden
		await expect(skipLink).toBeHidden();

		// Hover should not make it visible
		await skipLink.hover();
		await expect(skipLink).toBeHidden();
	});
});
