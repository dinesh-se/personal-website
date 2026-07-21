import { expect, test } from '@playwright/test';

test.describe('T-001: System-Driven Dark Mode (No Manual Toggle)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('no manual dark mode toggle is rendered in the header', async ({
		page,
	}) => {
		// GIVEN: page is loaded
		// THEN: there is no button offering to switch themes — theme always
		// follows the OS preference, by design
		const toggleButton = page.getByRole('button', {
			name: /toggle dark mode|switch theme|dark mode/i,
		});
		await expect(toggleButton).toHaveCount(0);
	});

	test('page renders dark background when system prefers dark', async ({
		page,
	}) => {
		// GIVEN: system preference is dark
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.reload();

		// THEN: body background reflects the dark palette (not the light one)
		const bodyBg = await page.evaluate(
			() => getComputedStyle(document.body).backgroundColor
		);
		expect(bodyBg).toContain('0, 0, 0');
	});

	test('page renders light background when system prefers light', async ({
		page,
	}) => {
		// GIVEN: system preference is light
		await page.emulateMedia({ colorScheme: 'light' });
		await page.reload();

		// THEN: body background reflects the light palette
		const bodyBg = await page.evaluate(
			() => getComputedStyle(document.body).backgroundColor
		);
		expect(bodyBg).not.toContain('0, 0, 0');
	});

	test('theme has no user-facing override — localStorage plays no role', async ({
		page,
	}) => {
		// GIVEN: some stale localStorage theme value is present
		await page.evaluate(() => localStorage.setItem('theme', 'dark'));
		await page.emulateMedia({ colorScheme: 'light' });
		await page.reload();

		// THEN: rendering still follows the OS preference (light), ignoring
		// any stored value — there is no app-level theme override
		const bodyBg = await page.evaluate(
			() => getComputedStyle(document.body).backgroundColor
		);
		expect(bodyBg).not.toContain('0, 0, 0');
	});
});
