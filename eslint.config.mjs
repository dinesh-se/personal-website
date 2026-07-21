import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
	{
		ignores: [
			'e2e/',
			'.next/',
			'node_modules/',
			'out/',
			'.out/',
			'next-env.d.ts',
		],
	},
	{
		...nextPlugin.configs['core-web-vitals'],
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
	},
	...tsPlugin.configs['flat/recommended'],
	{
		...jsxA11yPlugin.flatConfigs.strict,
		files: ['**/*.ts', '**/*.tsx'],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
	{
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			...prettierConfig.rules,
			'prettier/prettier': 'error',
			'arrow-body-style': 'off',
			'prefer-arrow-callback': 'off',
		},
	},
];
