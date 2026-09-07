import { expect, test } from '@playwright/test';

test.describe('T-007: Blog Section Typography and Spacing', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.locator('#writing').waitFor({ state: 'visible' });
	});

	test('AC-1: blog section body text has line-height >= 1.5', async ({
		page,
	}) => {
		const bodyTexts = page.locator('#writing [data-testid="blog-post-body"]');
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
		const bodyTexts = page.locator('#writing [data-testid="blog-post-body"]');
		const count = await bodyTexts.count();
		if (count > 0) {
			for (let i = 0; i < count; i++) {
				const letterSpacing = await bodyTexts.nth(i).evaluate((el) => {
					const style = getComputedStyle(el);
					const raw = style.letterSpacing;
					return raw === 'normal' ? 0 : parseFloat(raw);
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
		const grid = page.locator('#writing [data-testid="blog-post-grid"]');
		await grid.waitFor({ state: 'visible', timeout: 10000 });

		const gridClass = await grid.getAttribute('class');
		expect(gridClass).toMatch(/gap-(4|6|8|10|12|16|20)/);

		const gapValue = await grid.evaluate((el) => {
			const style = getComputedStyle(el);
			const rowGap = parseFloat(style.rowGap);
			const columnGap = parseFloat(style.columnGap);
			return { rowGap, columnGap };
		});
		expect(gapValue.rowGap).toBeGreaterThan(0);
		expect(gapValue.columnGap).toBeGreaterThanOrEqual(0);

		const cards = page.locator('#writing [data-testid="blog-post-card"]');
		const cardCount = await cards.count();
		if (cardCount > 0) {
			const padding = await cards.first().evaluate((el) => {
				const style = getComputedStyle(el);
				return {
					paddingTop: parseFloat(style.paddingTop),
					paddingBottom: parseFloat(style.paddingBottom),
				};
			});
			expect(padding.paddingTop).toBeGreaterThan(0);
			expect(padding.paddingBottom).toBeGreaterThan(0);
		}
	});

	test('AC-4: blog section spacing uses Tailwind utilities (no ad-hoc pixels)', async ({
		page,
	}) => {
		const grid = page.locator('#writing [data-testid="blog-post-grid"]');
		const gridClass = await grid.getAttribute('class');

		expect(gridClass).toMatch(/(?:mt|pt|pb|py)-\d+/);
		expect(gridClass).not.toMatch(/(?:m|p|mt|pt|pb|pl|pr|px|py)-\d+px/);
		expect(gridClass).not.toMatch(/gap-\d+px/);

		const mainEl = page.locator('main');
		const mainClass = await mainEl.getAttribute('class');
		expect(mainClass).toMatch(/p-\d+/);
		expect(mainClass).not.toMatch(/p-\d+px/);
	});

	test('AC-6: home page layout is not visually disrupted (scrollHeight stable)', async ({
		page,
	}) => {
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		const scrollHeight1 = await page.evaluate(() => document.body.scrollHeight);
		expect(scrollHeight1).toBeGreaterThan(0);

		await page.waitForTimeout(500);
		const scrollHeight2 = await page.evaluate(() => document.body.scrollHeight);
		expect(scrollHeight2).toBe(scrollHeight1);
	});

	test('AC-7: all blog post cards render without layout shifts', async ({
		page,
	}) => {
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		const cards = page.locator('#writing [data-testid="blog-post-card"]');
		const count = await cards.count();

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

		const grid = page.locator('#writing [data-testid="blog-post-grid"]');
		await expect(grid).toBeVisible();
	});
});
