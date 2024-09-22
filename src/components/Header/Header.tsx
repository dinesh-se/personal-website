import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

import { NavLinks } from '@components/NavLinks';

import Close from '@root/public/assets/close.svg';
import Hamburger from '@root/public/assets/hamburger.svg';
import Logo from '@root/public/assets/logo.svg';

import { Link as LinkType } from '@types';

const Header = () => {
	const linkActiveState = 'block sm:inline bg-stone-300 dark:bg-gray-900';
	const linkDefaultState =
		'block sm:inline hover:text-black dark:hover:bg-gray-700 dark:hover:text-white';
	const otherStyleClasses = 'rounded-md px-3 py-2 text-sm font-medium';
	const links: LinkType[] = [
		{
			label: 'About me',
			href: '/about',
		},
		{
			label: 'Projects',
			href: '/projects',
		},
		{
			label: 'Blog',
			href: '/blog',
		},
		{
			label: 'Uses',
			href: '/uses',
		},
	];
	const [isMobileMenuOpen, toggleMobileMenuState] = useState(false);

	return (
		<nav className="bg-gray-900 p-4">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						<button
							type="button"
							className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							aria-controls="mobile-menu"
							aria-expanded="false"
							onClick={() => toggleMobileMenuState(!isMobileMenuOpen)}
						>
							<span className="absolute -inset-0.5"></span>
							<span className="sr-only">Open main menu</span>
							<Hamburger
								className={clsx(
									{ block: !isMobileMenuOpen, hidden: isMobileMenuOpen },
									'h-6 w-6'
								)}
							/>
							<Close
								className={clsx(
									{ block: isMobileMenuOpen, hidden: !isMobileMenuOpen },
									'h-6 w-6'
								)}
							/>
						</button>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex flex-1 items-center justify-center sm:justify-start">
							<Link href="/" aria-label="Home page">
								<Logo className="svg-icon h-12 sm:h-14 w-12 sm:w-14" />
							</Link>
						</div>
						<div className="hidden sm:flex sm:items-center sm:flex-auto">
							<div className="flex space-x-4">
								<NavLinks
									links={links}
									linkActiveState={linkActiveState}
									linkDefaultState={linkDefaultState}
									otherStyleClasses={otherStyleClasses}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				className={clsx(
					{ block: isMobileMenuOpen, hidden: !isMobileMenuOpen },
					'sm:hidden'
				)}
				id="mobile-menu"
			>
				<div className="space-y-1 px-2 pb-3 pt-2">
					<NavLinks
						links={links}
						linkActiveState={linkActiveState}
						linkDefaultState={linkDefaultState}
						otherStyleClasses={otherStyleClasses}
					/>
				</div>
			</div>
		</nav>
	);
};

export default Header;
