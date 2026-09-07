import { NextResponse } from 'next/server';

import { getCachedBlogResult } from '@api/blog';

/**
 * GET /api/articles/me/published
 *
 * Resolves the Dev.to posts through a cached helper (`use cache` +
 * cacheLife('hours')), so the upstream Dev.to fetch is shared across visitors
 * rather than repeated per request. Returns the total post count alongside the
 * posts so the home page can conditionally render the "View all posts" link.
 *
 * On failure it returns the classified error taxonomy with a 503 status, which
 * BlogContent's client-side fallback consumes for graceful degradation.
 */
export async function GET() {
	const result = await getCachedBlogResult();

	if (!result.success) {
		return NextResponse.json(
			{ success: false, errorType: result.errorType },
			{ status: 503 }
		);
	}

	return NextResponse.json({
		success: true,
		total: result.posts.length,
		posts: result.posts.map((post) => ({
			...post,
			date: post.date.toISOString(),
		})),
	});
}
