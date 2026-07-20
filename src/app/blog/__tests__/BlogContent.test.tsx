import { render, screen, waitFor } from '@testing-library/react';

import { BlogFetchResult } from '@api/rest';

import { BlogContent } from '../BlogContent';

jest.mock('next/link', () => ({
	__esModule: true,
	default: ({
		children,
		href,
		...props
	}: React.PropsWithChildren<{ href: string; className?: string }>) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

jest.mock('@components/BlogPostCard', () => {
	function MockBlogPostCard({
		title,
		url,
		reactionsCount,
		date,
	}: {
		title: string;
		url: string;
		reactionsCount: number;
		date: Date;
	}) {
		return (
			<div data-testid="blog-post-card" data-href={url}>
				<h2>{title}</h2>
				<span data-testid="reactions">{reactionsCount}</span>
				<span data-testid="date">{date.toLocaleDateString('en-IN')}</span>
			</div>
		);
	}
	return { BlogPostCard: MockBlogPostCard };
});

const mockPosts = [
	{
		id: '1',
		title: 'First Post',
		description: 'Description of first post',
		date: new Date('2024-01-15'),
		url: 'https://dev.to/dinesh/first-post',
		commentsCount: 5,
		reactionsCount: 42,
		pageViewsCount: 100,
	},
	{
		id: '2',
		title: 'Second Post',
		description: 'Description of second post',
		date: new Date('2024-02-20'),
		url: 'https://dev.to/dinesh/second-post',
		commentsCount: 3,
		reactionsCount: 18,
		pageViewsCount: 75,
	},
];

// Mock global fetch so useEffect doesn't make real requests
beforeEach(() => {
	global.fetch = jest.fn().mockResolvedValue({
		ok: true,
		json: () =>
			Promise.resolve({
				success: true,
				posts: [
					{
						id: '1',
						title: 'First Post',
						description: 'Description of first post',
						date: new Date('2024-01-15').toISOString(),
						url: 'https://dev.to/dinesh/first-post',
						commentsCount: 5,
						reactionsCount: 42,
						pageViewsCount: 100,
					},
				],
			}),
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('BlogContent', () => {
	describe('Criterion 1: renders without console errors when API fails', () => {
		it('renders cleanly on network failure without console.error', () => {
			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			const result: BlogFetchResult = {
				success: false,
				errorType: 'network',
			};

			render(<BlogContent result={result} />);

			expect(consoleSpy).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it('renders cleanly on auth failure without console.error', () => {
			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			const result: BlogFetchResult = {
				success: false,
				errorType: 'auth',
			};

			render(<BlogContent result={result} />);

			expect(consoleSpy).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it('renders cleanly on rate limit failure without console.error', () => {
			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			const result: BlogFetchResult = {
				success: false,
				errorType: 'rate_limit',
			};

			render(<BlogContent result={result} />);

			expect(consoleSpy).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});

	describe('Criterion 2: displays user-friendly fallback message on failure', () => {
		it('shows fallback message instead of empty list', () => {
			const result: BlogFetchResult = {
				success: false,
				errorType: 'network',
			};

			render(<BlogContent result={result} />);

			expect(
				screen.getByText(
					'Blog posts are temporarily unavailable. Check back soon.'
				)
			).toBeInTheDocument();
		});

		it('renders no blog-post-cards when fetch fails', () => {
			const result: BlogFetchResult = {
				success: false,
				errorType: 'unknown',
			};

			render(<BlogContent result={result} />);

			expect(screen.queryByTestId('blog-post-card')).not.toBeInTheDocument();
		});
	});

	describe('Criterion 3: page layout is preserved on failure', () => {
		it('renders heading, intro text, and fallback message all together', () => {
			const result: BlogFetchResult = {
				success: false,
				errorType: 'unknown',
			};

			render(<BlogContent result={result} />);

			expect(
				screen.getByRole('heading', { name: 'Blog Posts' })
			).toBeInTheDocument();
			expect(
				screen.getByText(
					/I write about web development, software engineering, and other topics/
				)
			).toBeInTheDocument();
			expect(
				screen.getByText(
					'Blog posts are temporarily unavailable. Check back soon.'
				)
			).toBeInTheDocument();
		});

		it('renders Dev.To link in the intro text', () => {
			const result: BlogFetchResult = {
				success: false,
				errorType: 'network',
			};

			render(<BlogContent result={result} />);

			const devToLink = screen.getByRole('link', { name: /Dev\.To/i });
			expect(devToLink).toBeInTheDocument();
			expect(devToLink).toHaveAttribute('href', 'https://dev.to/');
		});
	});

	describe('Criterion 4: renders blog posts normally when API succeeds', () => {
		it('renders BlogPostCard components for each post', () => {
			const result: BlogFetchResult = {
				success: true,
				posts: mockPosts,
			};

			render(<BlogContent result={result} />);

			const cards = screen.getAllByTestId('blog-post-card');
			expect(cards).toHaveLength(2);
		});

		it('renders each card with correct link href', () => {
			const result: BlogFetchResult = {
				success: true,
				posts: mockPosts,
			};

			render(<BlogContent result={result} />);

			const cards = screen.getAllByTestId('blog-post-card');
			expect(cards[0]).toHaveAttribute(
				'data-href',
				'https://dev.to/dinesh/first-post'
			);
			expect(cards[1]).toHaveAttribute(
				'data-href',
				'https://dev.to/dinesh/second-post'
			);
		});

		it('renders each card with correct reaction count', () => {
			const result: BlogFetchResult = {
				success: true,
				posts: mockPosts,
			};

			render(<BlogContent result={result} />);

			const reactions = screen.getAllByTestId('reactions');
			expect(reactions[0]).toHaveTextContent('42');
			expect(reactions[1]).toHaveTextContent('18');
		});

		it('renders each card with correct date formatted in en-IN locale', () => {
			const result: BlogFetchResult = {
				success: true,
				posts: mockPosts,
			};

			render(<BlogContent result={result} />);

			const dates = screen.getAllByTestId('date');
			expect(dates[0]).toHaveTextContent('15/1/2024');
			expect(dates[1]).toHaveTextContent('20/2/2024');
		});

		it('renders no fallback message when posts are available', () => {
			const result: BlogFetchResult = {
				success: true,
				posts: mockPosts,
			};

			render(<BlogContent result={result} />);

			expect(
				screen.queryByText(
					'Blog posts are temporarily unavailable. Check back soon.'
				)
			).not.toBeInTheDocument();
		});
	});

	describe('client-side fetch from /api/articles/me/published', () => {
		it('fetches from the local API route when no result prop is provided', async () => {
			render(<BlogContent />);

			await waitFor(() => {
				expect(global.fetch).toHaveBeenCalledWith('/api/articles/me/published');
			});
		});

		it('renders posts fetched from the API', async () => {
			render(<BlogContent />);

			await waitFor(() => {
				const cards = screen.getAllByTestId('blog-post-card');
				expect(cards).toHaveLength(1);
			});
		});

		it('shows fallback when the API returns an error response', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				json: () =>
					Promise.resolve({
						success: false,
						errorType: 'auth',
					}),
			});

			render(<BlogContent />);

			await waitFor(() => {
				expect(
					screen.getByText(
						'Blog posts are temporarily unavailable. Check back soon.'
					)
				).toBeInTheDocument();
			});
		});

		it('shows fallback when fetch throws a network error', async () => {
			(global.fetch as jest.Mock).mockRejectedValueOnce(
				new Error('Network error')
			);

			render(<BlogContent />);

			await waitFor(() => {
				expect(
					screen.getByText(
						'Blog posts are temporarily unavailable. Check back soon.'
					)
				).toBeInTheDocument();
			});
		});
	});
});
