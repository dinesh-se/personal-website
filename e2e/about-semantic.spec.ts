import { expect, test } from '@playwright/test';

test.describe('T-005: About Page Rich Text Semantic HTML', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/about');
	});

	test('AC-1: about page has exactly one h1 element', async ({ page }) => {
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBe(1);
	});

	test('AC-2: rich text headings render as h2-h6 (not div wrappers)', async ({ page }) => {
		const headings = page.locator('main').locator('h2, h3, h4, h5, h6');
		const count = await headings.count();
		expect(count).toBeGreaterThan(0);
	});

	test('AC-3: rich text paragraphs render as p elements (not div)', async ({ page }) => {
		const paragraphs = page.locator('main').locator('p');
		const count = await paragraphs.count();
		expect(count).toBeGreaterThan(0);
	});

	test('AC-4: rich text lists render as ul/ol with li children (not div)', async ({ page }) => {
		const lists = page.locator('main').locator('ul, ol');
		const count = await lists.count();

		if (count === 0) {
			/* No lists in content — verify the default renderers produce semantic
			 * markup by checking that no div-based list wrappers exist instead. */
			const fakeLists = page.locator('main').locator(
				'div[class*="list"], div[class*="bullet"], div[class*="ordered"]',
			);
			const fakeCount = await fakeLists.count();
			expect(fakeCount).toBe(0);
			return;
		}

		for (let i = 0; i < count; i++) {
			const list = lists.nth(i);
			const tagName = await list.evaluate((el) => el.tagName.toLowerCase());
			expect(tagName).toMatch(/^u?ol$/);
			const lis = await list.locator('li').count();
			expect(lis).toBeGreaterThan(0);
		}
	});

	test('AC-5: rich text code blocks render as pre with code inside', async ({ page }) => {
		const codeBlocks = page.locator('main').locator('pre code');
		const count = await codeBlocks.count();

		if (count === 0) {
			/* No code blocks in content — verify no bare <pre> or non-semantic
			 * code containers exist as fallback indicators. */
			const barePres = page.locator('main').locator('pre');
			const bareCount = await barePres.count();
			expect(bareCount).toBe(0);
			return;
		}

		for (let i = 0; i < count; i++) {
			const pre = codeBlocks.nth(i).locator('..');
			const preTag = await pre.evaluate((el) => el.tagName.toLowerCase());
			expect(preTag).toBe('pre');
			const code = pre.locator('> code');
			const codeTag = await code.evaluate((el) => el.tagName.toLowerCase());
			expect(codeTag).toBe('code');
		}
	});

	test('AC-6: heading hierarchy has no skipped levels', async ({ page }) => {
		const headings = page.locator('main h2, main h3, main h4, main h5, main h6');
		const levels: number[] = [];
		for (let i = 0; i < await headings.count(); i++) {
			const tag = await headings.nth(i).evaluate(
				(el) => el.tagName.toLowerCase(),
			);
			const level = parseInt(tag.replace('h', ''), 10);
			levels.push(level);
		}
		for (let i = 1; i < levels.length; i++) {
			expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
		}
	});

	test('AC-7: axe-core reports zero landmark and heading-order violations', async ({
		page,
	}) => {
		/* Inject axe-core from CDN (no project dependency) and run targeted rules. */
		await page.evaluate(async () => {
			const script = document.createElement('script');
			script.src =
				'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
			return new Promise<void>((resolve) => {
				script.onload = () => resolve();
				document.head.appendChild(script);
			});
		});

		/* Wait for axe to be available */
		await page.waitForFunction(() => typeof (window as any).axe !== 'undefined');

		const violations = await page.evaluate(async () => {
			const { axe } = window as any;
			const results = await axe.run('main', {
				runOnly: {
					type: 'tag',
					values: ['cat.semantics', 'cat.bypass', 'cat.landmarks-and-frames'],
				},
			});
			return results.violations.map((v: any) => ({
				rule: v.id,
				description: v.description,
				count: v.nodes.length,
			}));
		});

		expect(violations).toEqual([]);
	});
});
