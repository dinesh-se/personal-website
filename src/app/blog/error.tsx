'use client';

import Link from 'next/link';

export default function Error({ reset }: { reset: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-6 h-16 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
			<h2 className="mb-4 text-2xl font-bold">Failed to load blog posts</h2>
			<p className="mb-8 max-w-md text-gray-600 dark:text-gray-300">
				Unable to load blog posts. Please try again.
			</p>
			<div className="flex gap-4">
				<button
					type="button"
					className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
					onClick={() => reset()}
				>
					Try again
				</button>
				<Link
					className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
					href="/"
				>
					Go Home
				</Link>
			</div>
		</div>
	);
}
