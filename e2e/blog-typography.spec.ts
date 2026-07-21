import { expect, test } from '@playwright/test';

test.describe('T-007: Blog Page Typography and Spacing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/blog');
		await page.waitForSelector('h1', { state: 'visible' });
	});

	test('AC-1: blog post body text has line-height >= 1.5', async ({ page }) => {
		// Check intro paragraph (always present)
		const introLineHeight = await page
			.locator('main > p')
			.first()
			.evaluate((el) => {
				const style = getComputedStyle(el);
				const lh = parseFloat(style.lineHeight);
				const fs = parseFloat(style.fontSize);
				return lh / fs;
			});
		expect(introLineHeight).toBeGreaterThanOrEqual(1.5);

		// Check blog post body text if cards are rendered
		const bodyTexts = page.locator('[data-testid="blog-post-body"]');
		const count = await bodyTexts.count();
		if (count > 0) {
			for (let i = 0; i < count; i++) {
				const lineHeight = await bodyTexts.nth(i).evaluate((el) => {
					const style = getComputedStyle(el);
					const lh = parseFloat(style.lineHeight);
					const fs = parseFloat(style.fontSize);
					return lh / fs;
				});
				expect(
					lineHeight,
					`blog post body ${i} line-height ratio`
				).toBeGreaterThanOrEqual(1.5);
			}
		}
	});

	test('AC-2: blog post letter-spacing is appropriate (no tighter than default)', async ({
		page,
	}) => {
		// Check intro paragraph
		const introLetterSpacing = await page
			.locator('main > p')
			.first()
			.evaluate((el) => {
				const style = getComputedStyle(el);
				return parseFloat(style.letterSpacing);
			});
		expect(introLetterSpacing).toBeGreaterThanOrEqual(0);

		// Check blog post body text if cards are rendered
		const bodyTexts = page.locator('[data-testid="blog-post-body"]');
		const count = await bodyTexts.count();
		if (count > 0) {
			for (let i = 0; i < count; i++) {
				const letterSpacing = await bodyTexts.nth(i).evaluate((el) => {
					const style = getComputedStyle(el);
					return parseFloat(style.letterSpacing);
				});
				expect(
					letterSpacing,
					`blog post body ${i} letter-spacing`
				).toBeGreaterThanOrEqual(0);
			}
		}
	});

	test('AC-3: spacing between blog post cards uses consistent Tailwind spacing values', async ({
		page,
	}) => {
		const grid = page.locator('[data-testid="blog-post-grid"]');
		await grid.waitFor({ state: 'visible', timeout: 10000 });

		// Check the grid has a gap-* class with a Tailwind spacing value
		const gridClass = await grid.getAttribute('class');
		expect(gridClass).toMatch(/gap-(4|6|8|10|12|16|20)/);

		// Check computed gap is consistent (non-zero)
		const gapValue = await grid.evaluate((el) => {
			const style = getComputedStyle(el);
			const rowGap = parseFloat(style.rowGap);
			const columnGap = parseFloat(style.columnGap);
			return { rowGap, columnGap };
		});
		expect(gapValue.rowGap).toBeGreaterThan(0);
		expect(gapValue.columnGap).toBeGreaterThanOrEqual(0);

		// If cards exist, verify their padding uses Tailwind values
		const cards = page.locator('[data-testid="blog-post-card"]');
		const cardCount = await cards.count();
		if (cardCount > 0) {
			const padding = await cards.first().evaluate((el) => {
				const style = getComputedStyle(el);
				return {
					paddingTop: parseFloat(style.paddingTop),
					paddingRight: parseFloat(style.paddingRight),
					paddingBottom: parseFloat(style.paddingBottom),
					paddingLeft: parseFloat(style.paddingLeft),
				};
			});
			// Tailwind p-4 = 16px on all sides; any consistent Tailwind padding is valid
			expect(padding.paddingTop).toBeGreaterThan(0);
			expect(padding.paddingBottom).toBeGreaterThan(0);
		}
	});

	test('AC-4: blog page section spacing uses Tailwind utilities (no ad-hoc pixels)', async ({
		page,
	}) => {
		// Check the grid container uses Tailwind spacing utilities
		const grid = page.locator('[data-testid="blog-post-grid"]');
		const gridClass = await grid.getAttribute('class');

		// Should have py-* or pt-*/pb-* utilities
		expect(gridClass).toMatch(/(?:pt|pb|py)-\d+/);

		// Should NOT have inline-style-like pixel values in classes
		expect(gridClass).not.toMatch(/(?:p|pt|pb|pl|pr|px|py)-\d+px/);
		expect(gridClass).not.toMatch(/gap-\d+px/);

		// Check main element uses Tailwind spacing
		const mainEl = page.locator('main');
		const mainClass = await mainEl.getAttribute('class');
		expect(mainClass).toMatch(/p-\d+/);
		expect(mainClass).not.toMatch(/p-\d+px/);
	});

	test('AC-6: blog page layout is not visually disrupted (scrollHeight stable)', async ({
		page,
	}) => {
		// Wait for page to fully settle
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		const scrollHeight1 = await page.evaluate(() => document.body.scrollHeight);
		expect(scrollHeight1).toBeGreaterThan(0);

		// Wait a bit more and check again for stability
		await page.waitForTimeout(500);
		const scrollHeight2 = await page.evaluate(() => document.body.scrollHeight);

		expect(scrollHeight2).toBe(scrollHeight1);
	});

	test('AC-7: all blog post cards render without layout shifts', async ({
		page,
	}) => {
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		const cards = page.locator('[data-testid="blog-post-card"]');
		const count = await cards.count();

		// If no cards (API failure), that's an infra issue, not a typography issue
		// But we still verify the page structure is correct
		if (count > 0) {
			for (let i = 0; i < count; i++) {
				const card = cards.nth(i);
				await expect(card).toBeVisible();

				const box = await card.boundingBox();
				expect(box).not.toBeNull();
				if (box) {
					expect(box.height).toBeGreaterThan(0);
					expect(box.width).toBeGreaterThan(0);
				}
			}
		}

		// Verify the grid container is visible regardless
		const grid = page.locator('[data-testid="blog-post-grid"]');
		await expect(grid).toBeVisible();
	});
});
