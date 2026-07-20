import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
	testDir: path.resolve(__dirname),
	testMatch: '**/*.spec.ts',
	webServer: {
		command: 'npm run dev -- --port 3099',
		port: 3099,
		timeout: 120_000,
		reuseExistingServer: !process.env.CI,
	},
	testIgnore: [
		'**/node_modules/**',
		'**/__mocks__/**',
		'**/__tests__/**',
		'**/*.test.tsx',
	],
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	// KALAM_BASE_URL: kalam starts a fresh `next dev` and runs specs immediately;
	// webpack compiles routes lazily on first hit, so a cold request can reset
	// under load. Retry so those first-hit transients self-heal (a real failure
	// still fails all attempts).
	retries: process.env.CI || process.env.KALAM_BASE_URL ? 2 : 0,
	// Serial under kalam/CI: on this box the check shares CPU with local LLM
	// inference, and parallel workers starve each other so client-side
	// hydration lags and interaction tests (mobile menu, nav) flake. One
	// worker gives each browser test full CPU so hydration finishes in time.
	workers: process.env.CI || process.env.KALAM_BASE_URL ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL:
			process.env.KALAM_BASE_URL ||
			process.env.BASE_URL ||
			'http://localhost:3099',
		trace: 'on-first-retry',
		navigationTimeout: 60000,
		actionTimeout: 30000,
	},
timeout: 60000,
expect: {
	timeout: 30000,
},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});
