import { getBlogFetchResult } from '../rest';

describe('getBlogFetchResult', () => {
	describe('success path', () => {
		it('returns success: true with posts on valid response', async () => {
			global.fetch = jest.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve([
						{
							id: '1',
							title: 'Test Post',
							description: 'A test',
							published_at: '2024-01-01T00:00:00Z',
							url: 'https://dev.to/test',
							comments_count: 0,
							public_reactions_count: 10,
							page_views_count: 100,
						},
					]),
			});

			const result = await getBlogFetchResult();

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.posts).toHaveLength(1);
				expect(result.posts[0].title).toBe('Test Post');
			}
		});
	});

	describe('error path', () => {
		it('returns errorType network on connection failure', async () => {
			global.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));

			const result = await getBlogFetchResult();

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errorType).toBe('network');
			}
		});

		it('returns errorType auth on 401 response', async () => {
			global.fetch = jest.fn().mockResolvedValue({
				ok: false,
				status: 401,
			});

			const result = await getBlogFetchResult();

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errorType).toBe('auth');
			}
		});

		it('returns errorType auth on 403 response', async () => {
			global.fetch = jest.fn().mockResolvedValue({
				ok: false,
				status: 403,
			});

			const result = await getBlogFetchResult();

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errorType).toBe('auth');
			}
		});

		it('returns errorType rate_limit on 429 response', async () => {
			global.fetch = jest.fn().mockResolvedValue({
				ok: false,
				status: 429,
			});

			const result = await getBlogFetchResult();

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errorType).toBe('rate_limit');
			}
		});

		it('returns errorType server on 500 response', async () => {
			global.fetch = jest.fn().mockResolvedValue({
				ok: false,
				status: 500,
			});

			const result = await getBlogFetchResult();

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errorType).toBe('server');
			}
		});

		it('does not emit console.error on any failure', async () => {
			global.fetch = jest.fn().mockRejectedValue(new Error('timeout'));
			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			await getBlogFetchResult();

			expect(consoleSpy).not.toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});
});
