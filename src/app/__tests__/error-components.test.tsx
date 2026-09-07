import { fireEvent, render, screen } from '@testing-library/react';

import RootError from '../error';

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
});
