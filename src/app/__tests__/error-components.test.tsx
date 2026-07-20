import { fireEvent, render, screen } from '@testing-library/react';

import AboutError from '../about/error';
import BlogError from '../blog/error';
import RootError from '../error';
import ProjectsError from '../projects/error';
import UsesError from '../uses/error';

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

describe('Error Components', () => {
	describe('Root Error', () => {
		it('renders generic error message', () => {
			render(<RootError reset={jest.fn()} />);
			expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		});

		it('renders descriptive error text', () => {
			render(<RootError reset={jest.fn()} />);
			expect(
				screen.getByText(/An unexpected error occurred/)
			).toBeInTheDocument();
		});

		it('renders "Try again" button that calls reset', () => {
			const reset = jest.fn();
			render(<RootError reset={reset} />);
			fireEvent.click(screen.getByText('Try again'));
			expect(reset).toHaveBeenCalledTimes(1);
		});

		it('renders "Go Home" link pointing to /', () => {
			const { container } = render(<RootError reset={jest.fn()} />);
			const goHomeLink = container.querySelector('a[href="/"]');
			expect(goHomeLink).toBeInTheDocument();
			expect(goHomeLink).toHaveTextContent('Go Home');
		});

		it('renders skeleton-based fallback UI element', () => {
			const { container } = render(<RootError reset={jest.fn()} />);
			const skeleton = container.querySelector(
				'[class*="animate-pulse"][class*="rounded-full"]'
			);
			expect(skeleton).toBeInTheDocument();
		});
	});

	describe('About Error', () => {
		it('renders route-specific error message', () => {
			render(<AboutError reset={jest.fn()} />);
			expect(screen.getByText('Failed to load about page')).toBeInTheDocument();
		});

		it('renders route-specific descriptive text', () => {
			render(<AboutError reset={jest.fn()} />);
			expect(
				screen.getByText(/Unable to load profile information/)
			).toBeInTheDocument();
		});

		it('renders "Try again" button and "Go Home" link', () => {
			const reset = jest.fn();
			const { container } = render(<AboutError reset={reset} />);
			fireEvent.click(screen.getByText('Try again'));
			expect(reset).toHaveBeenCalled();
			expect(container.querySelector('a[href="/"]')).toHaveTextContent(
				'Go Home'
			);
		});
	});

	describe('Projects Error', () => {
		it('renders route-specific error message', () => {
			render(<ProjectsError reset={jest.fn()} />);
			expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
		});

		it('renders route-specific descriptive text', () => {
			render(<ProjectsError reset={jest.fn()} />);
			expect(
				screen.getByText(/Unable to load GitHub projects/)
			).toBeInTheDocument();
		});

		it('renders "Try again" button and "Go Home" link', () => {
			const reset = jest.fn();
			const { container } = render(<ProjectsError reset={reset} />);
			fireEvent.click(screen.getByText('Try again'));
			expect(reset).toHaveBeenCalled();
			expect(container.querySelector('a[href="/"]')).toHaveTextContent(
				'Go Home'
			);
		});
	});

	describe('Blog Error', () => {
		it('renders route-specific error message', () => {
			render(<BlogError reset={jest.fn()} />);
			expect(screen.getByText('Failed to load blog posts')).toBeInTheDocument();
		});

		it('renders route-specific descriptive text', () => {
			render(<BlogError reset={jest.fn()} />);
			expect(screen.getByText(/Unable to load blog posts/)).toBeInTheDocument();
		});

		it('renders "Try again" button and "Go Home" link', () => {
			const reset = jest.fn();
			const { container } = render(<BlogError reset={reset} />);
			fireEvent.click(screen.getByText('Try again'));
			expect(reset).toHaveBeenCalled();
			expect(container.querySelector('a[href="/"]')).toHaveTextContent(
				'Go Home'
			);
		});
	});

	describe('Uses Error', () => {
		it('renders route-specific error message', () => {
			render(<UsesError reset={jest.fn()} />);
			expect(screen.getByText('Failed to load uses page')).toBeInTheDocument();
		});

		it('renders route-specific descriptive text', () => {
			render(<UsesError reset={jest.fn()} />);
			expect(
				screen.getByText(/Unable to load your setup and tools/)
			).toBeInTheDocument();
		});

		it('renders "Try again" button and "Go Home" link', () => {
			const reset = jest.fn();
			const { container } = render(<UsesError reset={reset} />);
			fireEvent.click(screen.getByText('Try again'));
			expect(reset).toHaveBeenCalled();
			expect(container.querySelector('a[href="/"]')).toHaveTextContent(
				'Go Home'
			);
		});
	});
});
