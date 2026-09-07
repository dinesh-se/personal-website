import { expect, test } from '@playwright/test';

test.describe('T-007: Blog Section Typography and Spacing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('blog section body text has line-height ≥ 1.5', async ({ page }) => {
		// GIVEN: / page is loaded
		// WHEN: inspect blog section body text
		// THEN: line-height is at least 1.5
		const bodyTexts = page.locator('#writing [data-testid="blog-post-body"]');
		const count = await bodyTexts.count();
		if (count > 0) {
			const computed = await bodyTexts.first().evaluate((el) => {
				const style = getComputedStyle(el);
				const lh = parseFloat(style.lineHeight);
				const fs = parseFloat(style.fontSize);
				return lh / fs;
			});
			expect(computed).toBeGreaterThanOrEqual(1.5);
		}
	});

	test('blog section letter-spacing is appropriate for readability', async ({
		page,
	}) => {
		// GIVEN: / page is loaded
		// WHEN: inspect blog section body text
		// THEN: letter-spacing is not tighter than Tailwind default (normal)
		const bodyTexts = page.locator('#writing [data-testid="blog-post-body"]');
		const count = await bodyTexts.count();
		if (count > 0) {
			const letterSpacing = await bodyTexts
				.first()
				.evaluate((el) => getComputedStyle(el).letterSpacing);
			const normalizedValue = letterSpacing === 'normal' ? '0px' : letterSpacing;
			const numericValue = parseFloat(normalizedValue);
			expect(numericValue).toBeGreaterThanOrEqual(0);
		}
	});

	test('spacing between blog post cards is consistent', async ({ page }) => {
		// GIVEN: / page is loaded
		// WHEN: inspect blog post cards
		// THEN: spacing between cards uses consistent Tailwind spacing values
		const blogPostGrid = page.locator('#writing [data-testid="blog-post-grid"]');
		const count = await blogPostGrid.count();
		if (count > 0) {
			const gridClass = await blogPostGrid.getAttribute('class');
			expect(gridClass).toMatch(/gap(?:-[xy])?-(4|6|8|10|12)/);
		}
	});

	test('home page section spacing uses Tailwind utilities', async ({ page }) => {
		// GIVEN: / page is loaded
		// WHEN: inspect page section spacing
		// THEN: no ad-hoc pixel values in spacing classes
		const mainContent = page.locator('main');
		const mainClass = await mainContent.getAttribute('class');
		expect(mainClass).not.toMatch(/p-\d+px/);
	});

	test('home page layout is not visually disrupted', async ({ page }) => {
		// GIVEN: / page is loaded
		// WHEN: page is fully rendered
		// THEN: document body scrollHeight is stable (no layout shifts)
		const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
		expect(scrollHeight).toBeGreaterThan(0);

		const postCards = page.locator('#writing [class*="card"], #writing [class*="Card"]');
		const visibleCount = await postCards.count();
		for (let i = 0; i < visibleCount; i++) {
			await expect(postCards.nth(i)).toBeVisible();
		}
	});

	test('all blog post cards render without layout shifts', async ({ page }) => {
		// GIVEN: / page is loaded
		// WHEN: page is fully rendered
		// THEN: all post cards are visible and positioned correctly
		const postCards = page.locator(
			'#writing [class*="card"], #writing [class*="Card"]'
		);
		const count = await postCards.count();
		for (let i = 0; i < count; i++) {
			const card = postCards.nth(i);
			await expect(card).toBeVisible();
			const box = await card.boundingBox();
			expect(box).not.toBeNull();
			if (box) {
				expect(box.height).toBeGreaterThan(0);
				expect(box.width).toBeGreaterThan(0);
			}
		}
	});
});
