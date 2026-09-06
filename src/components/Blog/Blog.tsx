import { BlogPostCard } from '@components/BlogPostCard';

import { BlogPostUI } from '@types';

export interface BlogProps {
	posts: BlogPostUI[];
	total: number;
}

const DEVTO_PROFILE = 'https://dev.to/dinesh-se';

const Blog = ({ posts, total }: BlogProps) => {
	if (total === 0) return null;

	return (
		<section id="writing" aria-label="Writing" className="py-16">
			<h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
				Latest from the blog
			</h2>
			<div
				className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
				data-testid="blog-post-grid"
			>
				{posts.map(({ id, ...rest }) => (
					<BlogPostCard key={id} {...rest} />
				))}
			</div>
			{total > 3 && (
				<p className="mt-6">
					<a
						className="inline-block text-sm font-medium text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
						href={DEVTO_PROFILE}
						target="_blank"
						rel="noreferrer"
					>
						View all posts on Dev.to →
					</a>
				</p>
			)}
		</section>
	);
};

export default Blog;
