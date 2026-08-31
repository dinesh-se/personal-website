import { render } from '@testing-library/react';

import AboutLoading from '../about/loading';
import BlogLoading from '../blog/loading';
import RootLoading from '../loading';
import UsesLoading from '../uses/loading';

describe('Loading Components', () => {
	describe('Root Loading', () => {
		it('renders skeleton placeholders matching home page structure', () => {
			const { container } = render(<RootLoading />);
			expect(container).toMatchSnapshot();

			// Verify key structural elements are present
			const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it('renders greeting, name, and subline skeletons', () => {
			const { container } = render(<RootLoading />);
			// Greeting <p> with skeleton
			expect(container.querySelector('p')).toBeInTheDocument();
			// Name <h1> with skeleton
			expect(container.querySelector('h1')).toBeInTheDocument();
			// Subline paragraph (no longer a heading — home subline is hardcoded text)
			expect(
				container.querySelector('p[class*="max-w-2xl"]')
			).toBeInTheDocument();
		});

		it('renders blog strip and experience section skeletons', () => {
			const { container } = render(<RootLoading />);
			// Blog strip grid section
			const blogSection = container.querySelector('section[class*="mt-16"]');
			expect(blogSection).toBeInTheDocument();
			// Experience card
			expect(
				container.querySelector('div[class*="rounded-2xl"]')
			).toBeInTheDocument();
		});
	});

	describe('About Loading', () => {
		it('renders skeleton placeholders matching about page structure', () => {
			const { container } = render(<AboutLoading />);
			expect(container).toMatchSnapshot();
		});

		it('renders title, bio text, image, and tech logos skeletons', () => {
			const { container } = render(<AboutLoading />);
			expect(container.querySelector('h1')).toBeInTheDocument();
			// Bio section
			expect(
				container.querySelector('section[class*="md:flex"]')
			).toBeInTheDocument();
			// Tech section
			expect(
				container.querySelector('section[class*="bg-neutral-200"]')
			).toBeInTheDocument();
		});

		it('uses valid Tailwind classes for image placeholder (not h-90/w-90)', () => {
			const { container } = render(<AboutLoading />);
			const imageSkeleton = container.querySelector(
				'[class*="rounded-lg"][class*="animate-pulse"]'
			);
			expect(imageSkeleton).toBeInTheDocument();
			const classes = imageSkeleton?.className || '';
			// h-90 and w-90 are NOT valid Tailwind classes (scale jumps 80→96)
			// Must use arbitrary value like h-[360px] w-[360px] to match the 360x360 image
			expect(classes).not.toContain('h-90');
			expect(classes).not.toContain('w-90');
			expect(classes).toContain('h-[360px]');
			expect(classes).toContain('w-[360px]');
		});
	});

	describe('Blog Loading', () => {
		it('renders skeleton placeholders matching blog page structure', () => {
			const { container } = render(<BlogLoading />);
			expect(container).toMatchSnapshot();
		});

		it('renders title, description, and blog post card skeletons', () => {
			const { container } = render(<BlogLoading />);
			expect(container.querySelector('h1')).toBeInTheDocument();
			const cards = container.querySelectorAll('[class*="shadow-lg"]');
			expect(cards.length).toBe(3);
		});
	});

	describe('Uses Loading', () => {
		it('renders skeleton placeholders matching uses page structure', () => {
			const { container } = render(<UsesLoading />);
			expect(container).toMatchSnapshot();
		});

		it('renders title, description, and category section skeletons', () => {
			const { container } = render(<UsesLoading />);
			expect(container.querySelector('h1')).toBeInTheDocument();
			const sections = container.querySelectorAll('section');
			expect(sections.length).toBe(3);
		});
	});
});
