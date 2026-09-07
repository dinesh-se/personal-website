import { cacheLife } from 'next/cache';

import { BlogFetchResult, BlogPostUI, getBlogFetchResult } from './rest';

export interface BlogFeed {
	posts: BlogPostUI[];
	total: number;
}

/**
 * Cached wrapper around getBlogFetchResult. Extracted to a helper (not the
 * route handler body) because `use cache` cannot be used directly inside a
 * Route Handler per the Next 16 docs. The cached response revalidates
 * according to `cacheLife`.
 */
export async function getCachedBlogResult(): Promise<BlogFetchResult> {
	'use cache';
	cacheLife('hours');

	return getBlogFetchResult();
}

/**
 * Server-side cached feed of the published Dev.to posts.
 *
 * Shared by the /blog page and the home "Latest from the blog" strip. The
 * `use cache` directive (paired with `cacheLife('hours')`) makes the Dev.to
 * fetch part of the prerendered static shell, so it is not repeated on every
 * visitor request. On failure it returns an empty feed (never throws),
 * preserving the page-level graceful fallback behaviour.
 */
export async function getBlogFeed(): Promise<BlogFeed> {
	'use cache';
	cacheLife('hours');

	const result = await getCachedBlogResult();

	if (!result.success) {
		return { posts: [], total: 0 };
	}

	return { posts: result.posts, total: result.posts.length };
}
