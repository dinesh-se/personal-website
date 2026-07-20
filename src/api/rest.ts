import { BlogPost, BlogPostUI } from '@types';

export type FetchErrorType =
	'network' | 'rate_limit' | 'auth' | 'server' | 'unknown';

export type BlogFetchResult =
	| { success: true; posts: BlogPostUI[] }
	| { success: false; errorType: FetchErrorType };

const getBlogPosts = async (): Promise<BlogPostUI[]> => {
	const res = await fetch('https://dev.to/api/articles/me/published', {
		headers: {
			'api-key': process.env.DEVTO_KEY || '',
		},
	});

	if (!res.ok) {
		throw Object.assign(new Error('Failed to fetch blog posts'), {
			status: res.status,
		});
	}

	const data = await res.json();

	return data.map((post: BlogPost) => ({
		id: post.id,
		title: post.title,
		description: post.description,
		date: new Date(post.published_at),
		url: post.url,
		commentsCount: post.comments_count,
		reactionsCount: post.public_reactions_count,
		pageViewsCount: post.page_views_count,
	}));
};

const getBlogFetchResult = async (): Promise<BlogFetchResult> => {
	try {
		const posts = await getBlogPosts();
		return { success: true, posts };
	} catch (error: unknown) {
		const status = (error as { status?: number })?.status;
		let errorType: FetchErrorType = 'unknown';
		if (status === 401 || status === 403) {
			errorType = 'auth';
		} else if (status === 429) {
			errorType = 'rate_limit';
		} else if (status && status >= 500) {
			errorType = 'server';
		} else if (status === undefined) {
			errorType = 'network';
		}
		return { success: false, errorType };
	}
};

export { getBlogPosts, getBlogFetchResult };
