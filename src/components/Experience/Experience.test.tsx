import { render, screen } from '@testing-library/react';

import { Experience as ExperienceType } from '@types';

import Experience from './Experience';

describe('Experience', () => {
	it('correctly parses ISO 8601 (YYYY-MM-DD) date strings', () => {
		const props: ExperienceType = {
			organizations: [
				{
					orgName: 'Test Org',
					orgLogo: { url: 'https://test.org/logo' },
					title: 'Test Role',
					from: '2024-01-31',
					to: '2024-02-29',
				},
			],
		};
		render(<Experience {...props} />);
		expect(screen.getByText('Jan 2024')).toBeInTheDocument();
		expect(screen.getByText('Feb 2024')).toBeInTheDocument();
	});

	it('displays dates in MMM YYYY format', () => {
		const props: ExperienceType = {
			organizations: [
				{
					orgName: 'Test Org',
					orgLogo: { url: 'https://test.org/logo' },
					title: 'Test Role',
					from: '2023-05-15',
					to: '2024-12-20',
				},
			],
		};
		render(<Experience {...props} />);
		expect(screen.getByText('May 2023')).toBeInTheDocument();
		expect(screen.getByText('Dec 2024')).toBeInTheDocument();
	});

	it('does not render Invalid Date strings', () => {
		const props: ExperienceType = {
			organizations: [
				{
					orgName: 'Test Org',
					orgLogo: { url: 'https://test.org/logo' },
					title: 'Test Role',
					from: '2024-01-31',
					to: '2024-02-29',
				},
			],
		};
		render(<Experience {...props} />);
		expect(screen.queryByText('Invalid Date')).not.toBeInTheDocument();
	});

	it('renders Present when to is null', () => {
		const props: ExperienceType = {
			organizations: [
				{
					orgName: 'Current Org',
					orgLogo: { url: 'https://test.org/logo' },
					title: 'Current Role',
					from: '2024-03-01',
					to: undefined,
				},
			],
		};
		render(<Experience {...props} />);
		expect(screen.getByText('Present')).toBeInTheDocument();
	});

	it('renders correctly', () => {
		const props: ExperienceType = {
			organizations: [
				{
					orgName: 'Organization 1',
					orgLogo: {
						url: 'https://test.org/logo-1',
					},
					title: 'Title 1',
					from: '2024-01-01',
					to: '2024-01-31',
				},
				{
					orgName: 'Organization 2',
					orgLogo: {
						url: 'https://test.org/logo-2',
					},
					title: 'Title 2',
					from: '2024-02-01',
					to: '2024-02-29',
				},
			],
		};
		const { container } = render(<Experience {...props} />);
		expect(container).toMatchSnapshot();
	});
});
