import { render, screen } from '@testing-library/react';

import { Link, NavLinks as NavLinksType } from '@root/src/types';

import NavLinks from './NavLinks';

const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
	usePathname() {
		return mockUsePathname();
	},
}));

describe('NavLinks', () => {
	it('renders correctly with a active class', () => {
		const links: Link[] = [
			{
				label: 'label-1',
				href: '/label-1',
			},
			{
				label: 'label-2',
				href: '/label-2',
			},
		];
		const props: NavLinksType = {
			links,
			linkActiveState: 'active-class',
			linkDefaultState: 'default-class',
			otherStyleClasses: 'other-class',
		};
		mockUsePathname.mockImplementation(() => '/label-1');
		const { container } = render(<NavLinks {...props} />);

		expect(container).toMatchSnapshot();
		expect(screen.getByText('label-1')).toHaveClass('active-class');
		expect(screen.getByText('label-2')).not.toHaveClass('active-class');
	});

	it('renders correctly with no active class', () => {
		const links: Link[] = [
			{
				label: 'label-1',
				href: '/label-1',
			},
			{
				label: 'label-2',
				href: '/label-2',
			},
		];
		const props: NavLinksType = {
			links,
			linkActiveState: 'active-class',
			linkDefaultState: 'default-class',
			otherStyleClasses: 'other-class',
		};
		mockUsePathname.mockImplementation(() => '/label-unknown');
		const { container } = render(<NavLinks {...props} />);

		expect(container).toMatchSnapshot();
		expect(screen.getByText('label-1')).not.toHaveClass('active-class');
		expect(screen.getByText('label-2')).not.toHaveClass('active-class');
	});
});
