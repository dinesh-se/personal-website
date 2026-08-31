import { getBlogFeed } from '../blog';
import { getBlogFetchResult } from '../rest';

jest.mock('next/cache', () => ({
	cacheLife: jest.fn(),
}));

// Mock the rest module entirely (named-import bindings are non-configurable
// in the transpiled output, so jest.spyOn on the module namespace fails).
jest.mock('../rest', () => ({
	getBlogFetchResult: jest.fn(),
}));

const mockGetBlogFetchResult = getBlogFetchResult as jest.Mock;

describe('getBlogFeed', () => {
	it('returns posts and total count on success', async () => {
		const posts = [
			{
				id: '1',
				title: 'Post 1',
				description: 'd',
				date: new Date('2024-01-01'),
				url: 'https://dev.to/p1',
				commentsCount: 1,
				reactionsCount: 2,
				pageViewsCount: 3,
			},
		];
		mockGetBlogFetchResult.mockResolvedValue({ success: true, posts });

		const feed = await getBlogFeed();

		expect(feed.posts).toHaveLength(1);
		expect(feed.total).toBe(1);
	});

	it('returns empty feed without throwing on failure', async () => {
		mockGetBlogFetchResult.mockResolvedValue({
			success: false,
			errorType: 'network',
		});

		const feed = await getBlogFeed();

		expect(feed.posts).toHaveLength(0);
		expect(feed.total).toBe(0);
	});
});
