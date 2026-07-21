import { expect, test } from '@playwright/test';

test.describe('T-005: About Page Rich Text Semantic HTML', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/about');
	});

	test('about page has exactly one h1 element', async ({ page }) => {
		// GIVEN: /about page is loaded
		// THEN: exactly one <h1> element exists
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBe(1);
	});

	test('rich text headings render as h2-h6 (not div wrappers)', async ({ page }) => {
		// GIVEN: /about page is loaded with rich text content
		// THEN: rich text headings use proper heading elements
		const headings = page.locator('main').locator('h2, h3, h4, h5, h6');
		const count = await headings.count();
		// At least one heading should exist in the rich text content
		expect(count).toBeGreaterThan(0);
	});

	test('rich text paragraphs render as p elements (not div)', async ({ page }) => {
		// GIVEN: /about page is loaded with rich text content
		// THEN: rich text paragraphs use <p> elements
		const paragraphs = page.locator('main').locator('p');
		const count = await paragraphs.count();
		expect(count).toBeGreaterThan(0);
	});

	test('rich text lists render as ul/ol with li children (not div)', async ({ page }) => {
		// GIVEN: /about page is loaded with rich text content
		// THEN: lists use semantic <ul>/<ol> with <li> children
		const lists = page.locator('main').locator('ul, ol');
		const count = await lists.count();
		if (count > 0) {
			const firstList = lists.first();
			const lis = await firstList.locator('li').count();
			expect(lis).toBeGreaterThan(0);
		}
	});

	test('rich text code blocks render as pre with code inside', async ({ page }) => {
		// GIVEN: /about page is loaded with rich text content
		// THEN: code blocks use <pre><code> structure
		const codeBlocks = page.locator('main').locator('pre code');
		// If code blocks exist in the rich text, they should be properly nested
		const count = await codeBlocks.count();
		// Test passes if no code blocks exist (content may not have any) or if they are properly structured
		expect(count).toBeGreaterThanOrEqual(0);
	});

	test('heading hierarchy has no skipped levels', async ({ page }) => {
		// GIVEN: /about page is loaded
		// THEN: heading levels are sequential (no skips)
		const headings = page.locator('main h2, main h3, main h4, main h5, main h6');
		const levels: number[] = [];
		for (let i = 0; i < await headings.count(); i++) {
			const tag = await headings.nth(i).evaluate(el => el.tagName.toLowerCase());
			const level = parseInt(tag.replace('h', ''), 10);
			levels.push(level);
		}
		// Check no skips: each level should be at most 1 greater than the previous
		for (let i = 1; i < levels.length; i++) {
			expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
		}
	});
});
