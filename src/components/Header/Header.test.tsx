import { render, screen } from '@testing-library/react';

import Header from './Header';

jest.mock('next/link', () => ({
	__esModule: true,
	default: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

describe('Header', () => {
	it('renders correctly', () => {
		const { container } = render(<Header />);
		expect(container).toMatchSnapshot();
	});

	it('renders navigation links', () => {
		render(<Header />);

		// Links appear in both desktop and mobile nav
		expect(screen.getAllByText('About').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Writing').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Contact').length).toBeGreaterThanOrEqual(1);
		// Removed routes/links must not appear.
		expect(screen.queryAllByText('Uses').length).toBe(0);
		expect(screen.queryAllByText('About me').length).toBe(0);
		expect(screen.queryAllByText('Blog').length).toBe(0);
	});

	it('renders home page logo link', () => {
		render(<Header />);

		const logoLink = screen.getByRole('link', { name: /home page/i });
		expect(logoLink).toBeInTheDocument();
	});
});
