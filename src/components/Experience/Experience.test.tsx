import { render } from '@testing-library/react';

import { Experience as ExperienceType } from '@types';

import Experience from './Experience';

describe('Experience', () => {
	it('renders correctly', () => {
		const props: ExperienceType = {
			organizations: [
				{
					orgName: 'Organization 1',
					orgLogo: {
						url: 'https://test.org/logo-1',
					},
					title: 'Title 1',
					from: '01/01/2024',
					to: '31/01/2024',
				},
				{
					orgName: 'Organization 2',
					orgLogo: {
						url: 'https://test.org/logo-2',
					},
					title: 'Title 2',
					from: '01/02/2024',
					to: '29/02/2024',
				},
			],
		};
		const { container } = render(<Experience {...props} />);
		expect(container).toMatchSnapshot();
	});
});
