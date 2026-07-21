import { render, screen } from '@testing-library/react';

import Header from './Header';

jest.mock('next/link', () => {
	const ActualLink = (
		jest.requireActual('next/link') as {
			default: typeof import('next/link').default;
		}
	).default;
	return {
		__esModule: true,
		default: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
			<a href={href} {...props}>
				{children}
			</a>
		),
	};
});

describe('Header', () => {
	it('renders correctly', () => {
		const { container } = render(<Header />);
		expect(container).toMatchSnapshot();
	});

	it('renders navigation links', () => {
		render(<Header />);

		// Links appear in both desktop and mobile nav
		expect(screen.getAllByText('About me').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Projects').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Blog').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Uses').length).toBeGreaterThanOrEqual(1);
	});

	it('renders home page logo link', () => {
		render(<Header />);

		const logoLink = screen.getByRole('link', { name: /home page/i });
		expect(logoLink).toBeInTheDocument();
	});
});
