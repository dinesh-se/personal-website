import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	dir: './',
});

const initialConfig: Config = {
	moduleNameMapper: {
		'^@root/(.*)$': '<rootDir>/src/root/$1',
		'^@components/(.*)$': '<rootDir>/src/components/$1',
		'^@api/(.*)$': '<rootDir>/src/api/$1',
		'^@styles/(.*)$': '<rootDir>/src/styles/$1',
		'^@types(.*)$': '<rootDir>/src/types/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testEnvironment: 'jest-environment-jsdom',
	// verbose: true,
};

const jestConfig = async () => {
	const nextJestConfig = await createJestConfig(initialConfig)();

	return {
		...nextJestConfig,
		moduleNameMapper: {
			'\\.svg$': '<rootDir>/__mocks__/svg.ts',
			...nextJestConfig.moduleNameMapper,
		},
		transformIgnorePatterns: ['node_modules/(?!(react-social-icons))'],
	};
};

export default jestConfig;
