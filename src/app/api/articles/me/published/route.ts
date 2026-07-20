import { NextResponse } from 'next/server';

import { getBlogFetchResult } from '@api/rest';

export async function GET() {
	const result = await getBlogFetchResult();

	if (!result.success) {
		return NextResponse.json(
			{ success: false, errorType: result.errorType },
			{ status: 503 }
		);
	}

	return NextResponse.json({
		success: true,
		posts: result.posts.map((post) => ({
			...post,
			date: post.date.toISOString(),
		})),
	});
}
