import { render } from '@testing-library/react';

import { Projects } from '@types';

import RecentProjects from './RecentProjects';

describe('RecentProjects', () => {
	it('renders correctly', async () => {
		const props: Projects = {
			projects: [
				{
					id: 'id-1',
					name: 'Repo 1',
					url: 'https://github/repo/1',
					description: 'Github Repository 1',
				},
				{
					id: 'id-2',
					name: 'Repo 2',
					url: 'https://github/repo/2',
					description: 'Github Repository 2',
				},
				{
					id: 'id-3',
					name: 'Repo 3',
					url: 'https://github/repo/3',
					description: 'Github Repository 3',
				},
			],
		};
		const { container } = render(<RecentProjects {...props} />);
		expect(container).toMatchSnapshot();
	});
});
