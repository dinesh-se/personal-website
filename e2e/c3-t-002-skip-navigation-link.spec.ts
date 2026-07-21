import { expect, test } from '@playwright/test';

test.describe('T-002: Skip Navigation Link', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('skip navigation link is hidden by default', async ({ page }) => {
		// GIVEN: page is loaded, no interaction yet
		const skipLink = page.getByRole('link', { name: /skip to main content/i });

		// THEN: link exists but is visually hidden (sr-only renders 1x1 clipped box)
		await expect(skipLink).toBeAttached();
		const box = await skipLink.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.width).toBeLessThan(10);
			expect(box.height).toBeLessThan(10);
		}
	});

	test('skip navigation link becomes visible on first Tab press', async ({ page }) => {
		// GIVEN: page is loaded
		const skipLink = page.getByRole('link', { name: /skip to main content/i });

		// WHEN: press Tab on page load
		await page.keyboard.press('Tab');

		// THEN: skip link is focused and visually visible (not sr-only)
		await expect(skipLink).toBeFocused();
		await expect(skipLink).toBeVisible();
		const box = await skipLink.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.width).toBeGreaterThan(10);
			expect(box.height).toBeGreaterThan(10);
		}
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

		// THEN: skip link remains visually hidden (sr-only 1x1 box)
		let box = await skipLink.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.width).toBeLessThan(10);
			expect(box.height).toBeLessThan(10);
		}

		// Hover should not make it visually visible.
		// sr-only elements are clipped (1x1) and outside the viewport,
		// so they cannot practically be hovered. Verify via JS that
		// dispatching a mouseover doesn't change the visual state.
		await page.evaluate(el => {
			if (el) el.dispatchEvent(new Event('mouseover', { bubbles: true }));
		}, await skipLink.elementHandle());
		box = await skipLink.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.width).toBeLessThan(10);
			expect(box.height).toBeLessThan(10);
		}
	});
});
