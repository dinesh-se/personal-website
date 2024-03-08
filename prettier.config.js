module.exports = {
	plugins: [
		'prettier-plugin-tailwindcss',
		'@trivago/prettier-plugin-sort-imports',
	],
	arrowParens: 'always',
	bracketSpacing: true,
	printWidth: 80,
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'es5',
	tailwindConfig: './tailwind.config.ts',
	useTabs: true,
	importOrder: [
		'<THIRD_PARTY_MODULES>',
		'^@api/(.*)$',
		'^@components/(.*)$',
		'^@styles/(.*)$',
		'^@root/(.*)$',
		'^@types$',
		'^[./]',
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
};
