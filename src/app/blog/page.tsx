'use cache';
// cacheLife: medium
import type { Metadata } from 'next';

import { getBlogFetchResult } from '@api/rest';

import { BlogContent } from './BlogContent';

export async function generateMetadata(): Promise<Metadata> {
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
	const result = await getBlogFetchResult();

	return <BlogContent result={result} />;
}
