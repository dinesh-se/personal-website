import { render, screen } from '@testing-library/react';

import { Experience as ExperienceType } from '@types';

import Experience from './Experience';

describe('Experience', () => {
	it('correctly parses DD/MM/YYYY date strings', () => {
		const props: ExperienceType = {
			organizations: [
				{
					orgName: 'Test Org',
					orgLogo: { url: 'https://test.org/logo' },
					title: 'Test Role',
					from: '31/01/2024',
					to: '29/02/2024',
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
					from: '15/05/2023',
					to: '20/12/2024',
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
					from: '31/01/2024',
					to: '29/02/2024',
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
					from: '01/03/2024',
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
