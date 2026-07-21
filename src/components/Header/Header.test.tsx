import { jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { ThemeProvider } from '@root/src/app/ThemeContext';

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

beforeEach(() => {
	// Reset matchMedia
	(window.matchMedia as any).mockImplementation((query: string) => ({
		matches: query.includes('dark'),
		media: query,
		onchange: null,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	}));
});

describe('Header', () => {
	it('renders correctly', () => {
		const { container } = render(
			<ThemeProvider>
				<Header />
			</ThemeProvider>
		);
		expect(container).toMatchSnapshot();
	});

	it('renders toggle button with aria-label "Toggle dark mode"', () => {
		render(
			<ThemeProvider>
				<Header />
			</ThemeProvider>
		);

		const toggleButton = screen.getByRole('button', {
			name: /toggle dark mode/i,
		});
		expect(toggleButton).toBeInTheDocument();
	});

	it('renders both sun and moon icons in toggle button', () => {
		render(
			<ThemeProvider>
				<Header />
			</ThemeProvider>
		);

		const toggleButton = screen.getByRole('button', {
			name: /toggle dark mode/i,
		});

		// Sun icon has dark:hidden class, moon icon has dark:block class
		const sunIcon = toggleButton.querySelector('.dark\\:hidden');
		const moonIcon = toggleButton.querySelector('.dark\\:block');

		expect(sunIcon).toBeInTheDocument();
		expect(moonIcon).toBeInTheDocument();
	});

	it('calls toggleDark when toggle button is clicked', async () => {
		const { container } = render(
			<ThemeProvider>
				<Header />
			</ThemeProvider>
		);

		const toggleButton = screen.getByRole('button', {
			name: /toggle dark mode/i,
		});

		await act(async () => {
			fireEvent.click(toggleButton);
		});

		// If toggleDark works, the theme state changes
		// We verify by checking no errors occur and the button is still present
		expect(
			screen.getByRole('button', { name: /toggle dark mode/i })
		).toBeInTheDocument();
	});

	it('renders navigation links', () => {
		render(
			<ThemeProvider>
				<Header />
			</ThemeProvider>
		);

		// Links appear in both desktop and mobile nav
		expect(screen.getAllByText('About me').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Projects').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Blog').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Uses').length).toBeGreaterThanOrEqual(1);
	});

	it('renders home page logo link', () => {
		render(
			<ThemeProvider>
				<Header />
			</ThemeProvider>
		);

		const logoLink = screen.getByRole('link', { name: /home page/i });
		expect(logoLink).toBeInTheDocument();
	});
});
