import { expect, test } from '@playwright/test';

test.describe('T-002 — Experience formatDate Bug Fix', () => {
	/**
	 * GIVEN: The dev server is running and the home page loads with Hygraph organization data
	 * WHEN: The Experience component renders on the home page
	 * THEN: All date strings display as "MMM YYYY" (e.g. "Jan 2024") — no "Invalid Date"
	 */
	test('home page experience section shows valid MMM YYYY dates, no "Invalid Date"', async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })).toBeVisible();

		// The Experience section should be visible
		const experienceSection = page.getByRole('heading', { name: 'Experience' }).locator('..');
		await expect(experienceSection).toBeVisible();

		// Assert no "Invalid Date" appears anywhere on the page
		expect(await page.getByText('Invalid Date').count()).toBe(0);

		// Assert that date-like text (MMM YYYY format) appears in the experience section
		// The toLocaleDateString('en', { year: 'numeric', month: 'short' }) produces
		// patterns like "Jan 2024", "Feb 2024", etc.
		const datePattern = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/;
		const dateTexts = await experienceSection.getByText(datePattern).allTextContents();
		expect(dateTexts.length).toBeGreaterThan(0);

		expect(errors).toEqual([]);
	});

	/**
	 * GIVEN: The dev server is running and the home page loads
	 * WHEN: The Experience component renders organization entries
	 * THEN: Each organization entry shows org name, title, and two date labels (from — to/present)
	 */
	test('experience entries render org name, title, and date range', async ({ page }) => {
		await page.goto('/');

		const experienceSection = page.getByRole('heading', { name: 'Experience' }).locator('..');
		await expect(experienceSection).toBeVisible();

		// Each org entry has orgName (h4), title (p), and a date div
		const orgNames = await experienceSection.locator('h4.font-semibold').allTextContents();
		expect(orgNames.length).toBeGreaterThan(0);

		// Each entry should have a date range with " — " separator
		const dateRanges = await experienceSection.locator('div.text-sm > span[aria-hidden]').all();
		expect(dateRanges.length).toBeGreaterThan(0);

		// Verify each " — " is present between two date elements
		for (const span of dateRanges) {
			await expect(span).toHaveAttribute('aria-hidden', 'true');
			await expect(span).toHaveText(' — ');
		}
	});

	/**
	 * GIVEN: The dev server is running and the home page loads
	 * WHEN: An organization has to=null (current role)
	 * THEN: The date range shows "Present" instead of a second date
	 */
	test('current role shows "Present" instead of a second date', async ({ page }) => {
		await page.goto('/');

		const experienceSection = page.getByRole('heading', { name: 'Experience' }).locator('..');
		await expect(experienceSection).toBeVisible();

		// "Present" should appear for current/ongoing roles
		const hasPresent = await experienceSection.getByText('Present').count() > 0;
		expect(hasPresent).toBe(true);
	});
});
