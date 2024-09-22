import Link from 'next/link';
import { cache } from 'react';

import { getBlogPosts } from '@api/rest';

import { BlogPostCard } from '@components/BlogPostCard';

import { BlogPostUI } from '@root/src/types';

export const revalidate = 600;

const getPageData = cache(async () => {
	const blogPosts: BlogPostUI[] = await getBlogPosts();

	return blogPosts;
});

export default async function Blog() {
	const blogPosts = await getPageData();

	return (
		<>
			<h1 className="text-3xl">Blog Posts</h1>
			<p className="mt-4">
				I write about web development, software engineering, and other topics.
				Written on&nbsp;
				<Link
					className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
					href="https://dev.to/"
				>
					Dev.To
				</Link>
				.
			</p>
			<div className="sm:mx-16 md:mx-24 lg:mx-32 grid grid-cols-1 gap-4 pb-6 pt-4">
				{blogPosts.map(({ id, ...rest }) => (
					<BlogPostCard key={id} {...rest} />
				))}
			</div>
		</>
	);
}
