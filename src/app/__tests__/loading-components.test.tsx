import { render } from '@testing-library/react';

import RootLoading from '../loading';

describe('Loading Components', () => {
	describe('Root Loading', () => {
		it('renders skeleton placeholders matching home page structure', () => {
			const { container } = render(<RootLoading />);
			expect(container).toMatchSnapshot();

			// Verify key structural elements are present
			const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it('renders greeting and name skeletons', () => {
			const { container } = render(<RootLoading />);
			// Greeting <p> with skeleton
			expect(container.querySelector('p')).toBeInTheDocument();
			// Name skeleton span (no longer an h1 — name is skeleton text)
			expect(
				container.querySelector('span[class*="animate-pulse"]')
			).toBeInTheDocument();
			// Subline paragraph skeleton
			expect(
				container.querySelector('p[class*="max-w-2xl"]')
			).toBeInTheDocument();
		});

		it('renders blog strip skeleton section', () => {
			const { container } = render(<RootLoading />);
			// Blog strip grid section
			const blogSection = container.querySelector('section[class*="py-16"]');
			expect(blogSection).toBeInTheDocument();
			// Blog post card skeletons
			const cards = container.querySelectorAll('[class*="shadow-lg"]');
			expect(cards.length).toBe(3);
		});

		it('renders about and interests section skeletons', () => {
			const { container } = render(<RootLoading />);
			// Interests card (rounded-2xl)
			expect(
				container.querySelector('div[class*="rounded-2xl"]')
			).toBeInTheDocument();
			// About paragraph skeletons
			const aboutParagraphs = container.querySelectorAll('span[class*="h-4"]');
			expect(aboutParagraphs.length).toBeGreaterThanOrEqual(4);
		});
	});
});
