import { expect, test } from '@playwright/test';

test.describe('T-002 — Home Page Date Rendering & Runtime Health', () => {
	/**
	 * GIVEN: The dev server is running and the home page loads
	 * WHEN: The single-page homepage renders
	 * THEN: No "Invalid Date" appears anywhere and no runtime errors occur
	 */
	test('home page renders without "Invalid Date" or runtime errors', async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (
				msg.type() === 'error' &&
				!msg.text().includes('Failed to load resource')
			) {
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();

		// No "Invalid Date" appears anywhere on the page
		expect(await page.getByText('Invalid Date').count()).toBe(0);

		expect(errors).toEqual([]);
	});

	/**
	 * GIVEN: The user visits the single-page homepage
	 * WHEN: The page renders in the browser
	 * THEN: All sections render without runtime errors
	 */
	test('home page renders all sections without runtime errors', async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (
				message.type() === 'error' &&
				!message.text().includes('Failed to load resource')
			) {
				errors.push(message.text());
			}
		});

		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })
		).toBeVisible();

		// About section
		await expect(page.locator('#about')).toBeVisible();
		// Writing (blog) section
		await expect(page.locator('#writing')).toBeVisible();
		// Contact section
		await expect(page.locator('#contact')).toBeVisible();

		// No "Invalid Date" on the page
		expect(await page.getByText('Invalid Date').count()).toBe(0);

		expect(errors).toEqual([]);
	});

	/**
	 * GIVEN: The user is on the home page
	 * WHEN: Anchor navigation is used
	 * THEN: Clicking nav links scrolls to the right section
	 */
	test('anchor navigation scrolls to sections', async ({ page }) => {
		await page.goto('/');

		// Click About anchor
		await page
			.getByRole('navigation')
			.getByRole('link', { name: 'About' })
			.first()
			.click();
		await expect(page.locator('#about')).toBeInViewport();

		// Click Writing anchor
		await page
			.getByRole('navigation')
			.getByRole('link', { name: 'Writing' })
			.first()
			.click();
		await expect(page.locator('#writing')).toBeInViewport();

		// Click Contact anchor
		await page
			.getByRole('navigation')
			.getByRole('link', { name: 'Contact' })
			.first()
			.click();
		await expect(page.locator('#contact')).toBeInViewport();
	});
});
