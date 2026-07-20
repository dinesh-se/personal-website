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

		const experienceSection = page.getByRole('heading', { name: 'Experience' }).locator('..');
		await expect(experienceSection).toBeVisible();

		// No "Invalid Date" appears anywhere on the page
		expect(await page.getByText('Invalid Date').count()).toBe(0);

		// Date-like text (MMM YYYY format) appears in the experience section
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

		const orgNames = await experienceSection.locator('h4.font-semibold').allTextContents();
		expect(orgNames.length).toBeGreaterThan(0);

		// Each entry has a date range with " — " separator
		const dateRanges = await experienceSection.locator('div.text-sm > span[aria-hidden]').all();
		expect(dateRanges.length).toBeGreaterThan(0);

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

		const hasPresent = await experienceSection.getByText('Present').count() > 0;
		expect(hasPresent).toBe(true);
	});

	/**
	 * GIVEN: The user visits any of the five pages
	 * WHEN: Each page renders in the browser
	 * THEN: No runtime errors appear (no "Invalid Date", no JS errors)
	 */
	test('Home page renders without runtime errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
				errors.push(message.text());
			}
		});

		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1, name: 'Dinesh Haribabu' })).toBeVisible();

		// No "Invalid Date" on any page
		expect(await page.getByText('Invalid Date').count()).toBe(0);

		expect(errors).toEqual([]);
	});

	test('About page renders without runtime errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
				errors.push(message.text());
			}
		});

		await page.goto('/about');
		await expect(page.getByRole('heading', { level: 1, name: /about me/i })).toBeVisible();

		expect(await page.getByText('Invalid Date').count()).toBe(0);
		expect(errors).toEqual([]);
	});

	test('Projects page renders without runtime errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
				errors.push(message.text());
			}
		});

		await page.goto('/projects');
		await expect(page.getByRole('heading', { level: 1, name: /github projects/i })).toBeVisible();

		expect(await page.getByText('Invalid Date').count()).toBe(0);
		expect(errors).toEqual([]);
	});

	test('Blog page renders without runtime errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
				errors.push(message.text());
			}
		});

		await page.goto('/blog');
		await expect(page.getByRole('heading', { level: 1, name: /blog posts/i })).toBeVisible();

		expect(await page.getByText('Invalid Date').count()).toBe(0);
		expect(errors).toEqual([]);
	});

	test('Uses page renders without runtime errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
				errors.push(message.text());
			}
		});

		await page.goto('/uses');
		await expect(page.getByRole('heading', { level: 1, name: /uses/i })).toBeVisible();

		expect(await page.getByText('Invalid Date').count()).toBe(0);
		expect(errors).toEqual([]);
	});

	/**
	 * GIVEN: The user is on any page
	 * WHEN: Navigation renders in both Header and Footer
	 * THEN: The active navigation link is highlighted
	 */
	test('active navigation link highlighted in Header and Footer on /about', async ({ page }) => {
		await page.goto('/about');

		// Header nav
		const headerNav = page.locator('header nav');
		const aboutLink = headerNav.getByRole('link', { name: 'About me' });
		await expect(aboutLink).toHaveClass(/bg-stone-300/);

		// Footer nav
		const footerNav = page.locator('footer nav');
		const footerAboutLink = footerNav.getByRole('link', { name: 'About me' });
		await expect(footerAboutLink).toHaveClass(/font-semibold/);
	});

	/**
	 * GIVEN: The user is on any page
	 * WHEN: Navigation renders in both Header and Footer
	 * THEN: The active navigation link is highlighted
	 */
	test('active navigation link highlighted in Header and Footer on /projects', async ({ page }) => {
		await page.goto('/projects');

		const headerNav = page.locator('header nav');
		const projectsLink = headerNav.getByRole('link', { name: 'Projects' });
		await expect(projectsLink).toHaveClass(/bg-stone-300/);

		const footerNav = page.locator('footer nav');
		const footerProjectsLink = footerNav.getByRole('link', { name: 'Projects' });
		await expect(footerProjectsLink).toHaveClass(/font-semibold/);
	});
});
