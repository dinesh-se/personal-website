import { execSync } from 'child_process';
import path from 'path';
import { expect, test } from '@playwright/test';

const root = path.resolve(__dirname, '..');

test.describe('T-005 — Fix All Resulting ESLint Errors', () => {
	/**
	 * GIVEN: ESLint flat config is in place and all resulting errors are fixed
	 * WHEN: I run `npm run lint`
	 * THEN: ESLint exits with code 0 and output contains zero errors
	 */
	test('npm run lint exits with zero errors', () => {
		const result = execSync('npm run lint', {
			cwd: root,
			encoding: 'utf-8',
			maxBuffer: 10 * 1024 * 1024,
		});

		const output = result.toLowerCase();
		expect(output).not.toContain('error');
		expect(output).not.toMatch(/✖\s+\d+\s+problem/);
	});

	/**
	 * GIVEN: ESLint flat config is in place and all resulting errors are fixed
	 * WHEN: I run `npm run lint`
	 * THEN: ESLint output contains zero warnings
	 */
	test('npm run lint exits with zero warnings', () => {
		const result = execSync('npm run lint', {
			cwd: root,
			encoding: 'utf-8',
			maxBuffer: 10 * 1024 * 1024,
		});

		const output = result.toLowerCase();
		expect(output).not.toContain('warning');
	});

	/**
	 * GIVEN: ESLint config ignores e2e/ directory
	 * WHEN: I run `npm run lint`
	 * THEN: No ESLint errors are reported for files in e2e/
	 */
	test('e2e/ directory is properly ignored by ESLint', () => {
		const result = execSync('npm run lint', {
			cwd: root,
			encoding: 'utf-8',
			maxBuffer: 10 * 1024 * 1024,
		});

		const output = result.toLowerCase();
		expect(output).not.toContain('e2e/');
		expect(output).not.toContain('e2e\\');
	});

	/**
	 * GIVEN: All ESLint errors are fixed and source code is correct
	 * WHEN: I run `npm run typecheck`
	 * THEN: TypeScript compilation succeeds with zero errors
	 */
	test('npm run typecheck exits with zero errors', () => {
		execSync('npm run typecheck', {
			cwd: root,
			encoding: 'utf-8',
			maxBuffer: 10 * 1024 * 1024,
		});
	});

	/**
	 * GIVEN: All ESLint errors are fixed and source code is correct
	 * WHEN: I run `npm test`
	 * THEN: All tests pass
	 */
	test('npm test exits with zero failures', () => {
		execSync('npm test', {
			cwd: root,
			encoding: 'utf-8',
			maxBuffer: 10 * 1024 * 1024,
		});
	});
});
