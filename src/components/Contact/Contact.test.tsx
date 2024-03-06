import { render } from '@testing-library/react';

import { Contact as ContactType } from '@types';

import Contact from './Contact';

describe('Contact', () => {
	it('renders correctly', () => {
		const props: ContactType = {
			linkedin: 'https://linkedin.com',
			github: 'https://github.com',
			eMail: 'test@test.com',
		};
		const { container } = render(<Contact {...props} />);
		expect(container).toMatchSnapshot();
	});
});
