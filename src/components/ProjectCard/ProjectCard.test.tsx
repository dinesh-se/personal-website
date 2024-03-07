import { render } from '@testing-library/react';

import { RepoUI } from '@types';

import ProjectCard from './ProjectCard';

describe('ProjectCard', () => {
	it('renders correctly', () => {
		const props: RepoUI = {
			name: 'test-repo-name',
			description: 'test-description',
			href: 'https://test.repo.url',
			primaryLanguage: {
				name: 'TypeScript',
				color: '#ff00ff',
			},
		};
		const { container } = render(<ProjectCard {...props} />);
		expect(container).toMatchSnapshot();
	});
});
