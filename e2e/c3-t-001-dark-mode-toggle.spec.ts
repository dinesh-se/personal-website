import { expect, test } from '@playwright/test';

test.describe('T-001: Dark Mode Toggle', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('clicking the dark mode toggle switches the theme', async ({ page }) => {
		// GIVEN: site is running, page is loaded (light mode by default)
		const toggleButton = page.getByRole('button', { name: /toggle dark mode/i });
		await expect(toggleButton).toBeVisible();

		// WHEN: click the dark mode toggle in the header
		await toggleButton.click();

		// THEN: verify theme switches — html gets class="dark"
		await expect(page.locator('html')).toHaveClass(/dark/);
	});

	test('theme preference persists on page reload', async ({ page }) => {
		// GIVEN: user has toggled to dark mode
		const toggleButton = page.getByRole('button', { name: /toggle dark mode/i });
		await toggleButton.click();
		await expect(page.locator('html')).toHaveClass(/dark/);

		// WHEN: reload the page
		await page.reload();

		// THEN: verify the preference persists — still in dark mode
		await expect(page.locator('html')).toHaveClass(/dark/);
	});

	test('first visit defaults to system dark preference', async ({ page }) => {
		// GIVEN: no localStorage value, system preference is dark
		await page.evaluate(() => localStorage.clear());
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto('/');

		// THEN: defaults to system preference (dark mode)
		await expect(page.locator('html')).toHaveClass(/dark/);
	});

	test('first visit defaults to system light preference', async ({ page }) => {
		// GIVEN: no localStorage value, system preference is light
		await page.evaluate(() => localStorage.clear());
		await page.emulateMedia({ colorScheme: 'light' });
		await page.goto('/');

		// THEN: defaults to system preference (light mode)
		await expect(page.locator('html')).not.toHaveClass(/dark/);
	});

	test('toggle button contains sun/moon SVG icons', async ({ page }) => {
		// GIVEN: page is loaded
		const toggleButton = page.getByRole('button', { name: /toggle dark mode/i });
		await expect(toggleButton).toBeVisible();

		// THEN: button contains SVG icons
		const buttonContent = await toggleButton.innerHTML();
		expect(buttonContent).toContain('<svg');
	});
});
