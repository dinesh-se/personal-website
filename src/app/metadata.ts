import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
	return {
		title: 'Dinesh Haribabu',
		description:
			'A front-end web developer focused on crafting clean and intuitive interfaces providing better UX.',
		authors: {
			name: 'Dinesh Haribabu',
			url: 'https://dineshharibabu.in/',
		},
	};
}
