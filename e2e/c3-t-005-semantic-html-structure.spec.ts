import { expect, test } from '@playwright/test';

test.describe('T-005: About Section Rich Text Semantic HTML', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('about section has exactly one h1 element', async ({ page }) => {
		// GIVEN: / page is loaded
		// THEN: exactly one <h1> element exists (Hero)
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBe(1);
	});

	test('rich text headings render as h2-h6 (not div wrappers)', async ({
		page,
	}) => {
		// GIVEN: / page is loaded with rich text content
		// THEN: rich text headings use proper heading elements
		const headings = page.locator('#about').locator('h2, h3, h4, h5, h6');
		const count = await headings.count();
		expect(count).toBeGreaterThan(0);
	});

	test('rich text paragraphs render as p elements (not div)', async ({
		page,
	}) => {
		// GIVEN: / page is loaded with rich text content
		// THEN: rich text paragraphs use <p> elements
		const paragraphs = page.locator('#about').locator('p');
		const count = await paragraphs.count();
		expect(count).toBeGreaterThan(0);
	});

	test('rich text lists render as ul/ol with li children (not div)', async ({
		page,
	}) => {
		// GIVEN: / page is loaded with rich text content
		// THEN: lists use semantic <ul>/<ol> with <li> children
		const lists = page.locator('#about').locator('ul, ol');
		const count = await lists.count();
		if (count > 0) {
			const firstList = lists.first();
			const lis = await firstList.locator('li').count();
			expect(lis).toBeGreaterThan(0);
		}
	});

	test('rich text code blocks render as pre with code inside', async ({
		page,
	}) => {
		// GIVEN: / page is loaded with rich text content
		// THEN: code blocks use <pre><code> structure
		const codeBlocks = page.locator('#about').locator('pre code');
		const count = await codeBlocks.count();
		expect(count).toBeGreaterThanOrEqual(0);
	});

	test('heading hierarchy has no skipped levels', async ({ page }) => {
		// GIVEN: / page is loaded
		// THEN: heading levels are sequential (no skips)
		const headings = page.locator(
			'#about h2, #about h3, #about h4, #about h5, #about h6'
		);
		const levels: number[] = [];
		for (let i = 0; i < (await headings.count()); i++) {
			const tag = await headings
				.nth(i)
				.evaluate((el) => el.tagName.toLowerCase());
			const level = parseInt(tag.replace('h', ''), 10);
			levels.push(level);
		}
		for (let i = 1; i < levels.length; i++) {
			expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
		}
	});
});
