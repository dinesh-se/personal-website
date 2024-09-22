import { BlogPost, BlogPostUI } from '@types';

const getBlogPosts = async (): Promise<BlogPostUI[]> => {
	const res = await fetch('https://dev.to/api/articles/me/published', {
		headers: {
			'api-key': process.env.DEVTO_KEY || '',
		},
	});

	if (!res.ok) {
		throw new Error('Failed to fetch blog posts');
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

export { getBlogPosts };
