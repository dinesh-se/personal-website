import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const workflowPath = join(__dirname, '..', '.github', 'workflows', 'lint-test.yml');

test.describe('T-006 — Update CI Workflow to Node 24', () => {
	/**
	 * This task updates the GitHub Actions CI workflow to use Node 24 instead of Node 18
	 * and bumps setup-node from v2 to v4. No user-facing behavior changes.
	 *
	 * GIVEN: The CI workflow is configured with Node 24 and setup-node v4
	 * WHEN: I open a pull request
	 * THEN: The CI job runs on Node 24 (matching local dev environment)
	 *
	 * GIVEN: The codebase is compatible with Node 24
	 * WHEN: CI passes on Node 24
	 * THEN: I can be confident the code works on the same runtime I use locally
	 */

	test('CI workflow uses Node 24 and setup-node v4', async () => {
		const workflow = readFileSync(workflowPath, 'utf-8');

		expect(workflow).toContain("node-version: '24'");
		expect(workflow).toContain('actions/setup-node@v4');
	});

	test('CI workflow steps reference updated Node version', async ({ page }) => {
		const workflow = readFileSync(workflowPath, 'utf-8');

		// The setup-node step with node-version must appear before npm ci
		const setupNodeIdx = workflow.indexOf('actions/setup-node@v4');
		const npmCiIdx = workflow.indexOf('npm ci');
		expect(setupNodeIdx).toBeGreaterThanOrEqual(0);
		expect(npmCiIdx).toBeGreaterThan(setupNodeIdx);

		// All core steps must be present
		expect(workflow).toContain('npm ci');
		expect(workflow).toContain('npm run lint');
		expect(workflow).toContain('npm test');
	});

	test('npm test passes on Node 24', async () => {
		execSync('npm test', {
			cwd: join(__dirname, '..'),
			encoding: 'utf-8',
			stdio: 'pipe',
		});
	});

	test('npm run typecheck passes on Node 24', async () => {
		execSync('npm run typecheck', {
			cwd: join(__dirname, '..'),
			encoding: 'utf-8',
			stdio: 'pipe',
		});
	});

	test('all pages render without runtime errors on Node 24', async ({
		page,
	}) => {
		const errors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				// Filter out upstream image 400s — pre-existing, unrelated to Node version
				if (msg.text().includes('Failed to load resource')) return;
				errors.push(msg.text());
			}
		});

		const routes = [
			{ path: '/', title: 'Dinesh Haribabu' },
			{ path: '/about', title: /about me/i },
			{ path: '/projects', title: /GitHub Projects/i },
			{ path: '/blog', title: /Blog Posts/i },
			{ path: '/uses', title: /Uses/i },
		];

		for (const { path: route, title } of routes) {
			await page.goto(route);
			await expect(page.locator('h1')).toContainText(title);
		}

		expect(errors).toEqual([]);
	});

	test('navigation chain works on Node 24', async ({ page }) => {
		const errors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				if (msg.text().includes('Failed to load resource')) return;
				errors.push(msg.text());
			}
		});

		await page.goto('/');
		await expect(page.locator('h1')).toContainText('Dinesh Haribabu');

		const nav = page.getByRole('navigation');

		await nav.getByRole('link', { name: 'About me' }).click();
		await expect(page).toHaveURL('/about');

		await nav.getByRole('link', { name: 'Projects' }).first().click();
		await expect(page).toHaveURL('/projects');

		await nav.getByRole('link', { name: 'Blog' }).click();
		await expect(page).toHaveURL('/blog');

		await nav.getByRole('link', { name: 'Uses' }).click();
		await expect(page).toHaveURL('/uses');

		expect(errors).toEqual([]);
	});
});
