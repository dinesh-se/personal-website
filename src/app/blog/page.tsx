import type { Metadata } from 'next';

import { BlogContent } from './BlogContent';

export function generateMetadata(): Metadata {
	return {
		title: 'Blog — Dinesh Haribabu',
		description:
			'Blog posts about web development, software engineering, and other topics. Written on Dev.To.',
		authors: {
			name: 'Dinesh Haribabu',
			url: 'https://dineshharibabu.in/',
		},
	};
}

export default function Blog() {
	return <BlogContent />;
}
