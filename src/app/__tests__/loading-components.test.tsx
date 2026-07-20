import { render } from '@testing-library/react';

import AboutLoading from '../about/loading';
import BlogLoading from '../blog/loading';
import RootLoading from '../loading';
import ProjectsLoading from '../projects/loading';
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

		it('renders greeting, name, and summary skeletons', () => {
			const { container } = render(<RootLoading />);
			// Greeting <p> with skeleton
			expect(container.querySelector('p')).toBeInTheDocument();
			// Name <h1> with skeleton
			expect(container.querySelector('h1')).toBeInTheDocument();
			// Summary <h2> with skeleton
			expect(container.querySelector('h2')).toBeInTheDocument();
		});

		it('renders recent projects and experience section skeletons', () => {
			const { container } = render(<RootLoading />);
			// Two-column layout section
			const section = container.querySelector('section[class*="lg:flex-row"]');
			expect(section).toBeInTheDocument();
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

	describe('Projects Loading', () => {
		it('renders skeleton placeholders matching projects page structure', () => {
			const { container } = render(<ProjectsLoading />);
			expect(container).toMatchSnapshot();
		});

		it('renders grid of project card skeletons', () => {
			const { container } = render(<ProjectsLoading />);
			const grid = container.querySelector(
				'section[class*="grid-cols-1"][class*="sm:grid-cols-2"]'
			);
			expect(grid).toBeInTheDocument();
			const cards = grid?.querySelectorAll('[class*="rounded-md"]');
			expect(cards?.length).toBe(6);
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
