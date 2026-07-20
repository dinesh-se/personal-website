import Link from 'next/link';

import { BlogFetchResult } from '@api/rest';

import { BlogPostCard } from '@components/BlogPostCard';

interface BlogContentProps {
	result: BlogFetchResult;
}

export function BlogContent({ result }: BlogContentProps) {
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
				{result.success
					? result.posts.map(({ id, ...rest }) => (
							<BlogPostCard key={id} {...rest} />
						))
					: null}
				{!result.success && (
					<p className="text-gray-600 dark:text-gray-300 text-center py-8">
						Blog posts are temporarily unavailable. Check back soon.
					</p>
				)}
			</div>
		</>
	);
}
