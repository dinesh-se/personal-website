export interface BlogPost {
	id: string;
	title: string;
	description: string;
	published_at: string;
	url: string;
	comments_count: number;
	public_reactions_count: number;
	page_views_count: number;
}

export interface BlogPostUI
	extends Pick<BlogPost, 'title' | 'description' | 'url'> {
	id?: string;
	date: Date;
	commentsCount: number;
	reactionsCount: number;
	pageViewsCount: number;
}
