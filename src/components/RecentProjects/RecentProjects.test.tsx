import { render } from '@testing-library/react';

import RecentProjects from './RecentProjects';

describe('RecentProjects', () => {
	it('renders correctly', async () => {
		render(<RecentProjects />);
		// expect(container).toMatchSnapshot();
	});
});
