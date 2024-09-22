import { render } from '@testing-library/react';

import BlogPostCard from './BlogPostCard';

describe('BlogPostCard', () => {
	it('renders correctly', () => {
		const props = {
			title: 'Test Blog Post',
			description: 'This is a test description for the blog post.',
			date: new Date('2023-04-01'),
			url: 'https://example.com/test-blog-post',
			commentsCount: 10,
			reactionsCount: 20,
			pageViewsCount: 30,
		};

		const { container } = render(<BlogPostCard {...props} />);
		expect(container).toMatchSnapshot();
	});
});
