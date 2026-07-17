import path from 'path';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: path.resolve(__dirname),
	testMatch: '**/*.spec.ts',
	testIgnore: ['**/node_modules/**', '**/__mocks__/**', '**/__tests__/**', '**/*.test.tsx'],
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:3099',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: `NODE_OPTIONS='--require ${path.resolve(__dirname, 'setup.cjs')}' npm --prefix ${path.resolve(__dirname, '..')} run dev -- -p 3099`,
		port: 3099,
		reuseExistingServer: false,
		stdout: 'pipe',
		stderr: 'pipe',
		timeout: 60000,
	},
});
