import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
	testDir: path.resolve(__dirname),
	testMatch: '**/*.spec.ts',
	testIgnore: [
		'**/node_modules/**',
		'**/__mocks__/**',
		'**/__tests__/**',
		'**/*.test.tsx',
	],
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL:
			process.env.KALAM_BASE_URL ||
			process.env.BASE_URL ||
			'http://localhost:3003',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});
