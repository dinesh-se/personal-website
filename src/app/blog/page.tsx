import type { Metadata } from 'next';

import { getBlogFeed } from '@api/blog';

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

export default async function Blog() {
	// Server-side cached fetch; BlogContent keeps its client-side fallback for
	// graceful degradation when a render has no cached result.
	const feed = await getBlogFeed();

	const result =
		feed.total > 0
			? ({ success: true, posts: feed.posts } as const)
			: ({ success: false, errorType: 'unknown' } as const);

	return <BlogContent result={result} />;
}
