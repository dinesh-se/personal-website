'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BlogFetchResult, BlogPostUI } from '@api/rest';

import { BlogPostCard } from '@components/BlogPostCard';

interface BlogContentProps {
	result?: BlogFetchResult;
}

export function BlogContent({ result }: BlogContentProps) {
	const [fetchedResult, setFetchedResult] = useState<BlogFetchResult | null>(
		null
	);
	const [loading, setLoading] = useState(!result);

	const currentResult = result ?? fetchedResult;

	useEffect(() => {
		if (result) {
			return;
		}

		fetch('/api/articles/me/published')
			.then(async (res) => {
				const data = await res.json();
				if (data.success) {
					const posts: BlogPostUI[] = data.posts.map(
						(p: BlogPostUI & { date: string }) => ({
							...p,
							date: new Date(p.date),
						})
					);
					setFetchedResult({ success: true, posts });
				} else {
					setFetchedResult({
						success: false,
						errorType: data.errorType || 'unknown',
					});
				}
			})
			.catch(() => {
				setFetchedResult({ success: false, errorType: 'network' });
			})
			.finally(() => {
				setLoading(false);
			});
	}, [result]);

	if (loading) {
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
			</>
		);
	}

	if (!currentResult) {
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
			</>
		);
	}

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
				{currentResult.success
					? currentResult.posts.map(({ id, ...rest }) => (
							<BlogPostCard key={id} {...rest} />
						))
					: null}
				{!currentResult.success && (
					<p className="text-gray-600 dark:text-gray-300 text-center py-8">
						Blog posts are temporarily unavailable. Check back soon.
					</p>
				)}
			</div>
		</>
	);
}
