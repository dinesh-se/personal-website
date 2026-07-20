import { render } from '@testing-library/react';

import { ThemeProvider } from '@root/src/app/ThemeContext';

import Header from './Header';

describe('Header', () => {
	it('renders correctly', () => {
		const { container } = render(
			<ThemeProvider>
				<Header />
			</ThemeProvider>
		);
		expect(container).toMatchSnapshot();
	});
});
