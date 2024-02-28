import NavLinks from '@components/NavLinks';

import { Link as LinkType } from '@types';

const Footer = () => {
	const linkActiveState = 'font-semibold';
	const linkDefaultState =
		'text-neutral-500 hover:text-slate-700 dark:hover:text-white';
	const links: LinkType[] = [
		{
			label: 'Home',
			href: '/',
		},
		{
			label: 'About me',
			href: '/about',
		},
		{
			label: 'Projects',
			href: '/projects',
		},
		{
			label: 'Uses',
			href: '/uses',
		},
	];

	return (
		<footer
			className="m-auto flex max-w-7xl flex-col items-center justify-between
      gap-y-4 border-t
      border-slate-200 p-12 text-sm 
      sm:flex-row dark:border-slate-700 dark:text-slate-200"
		>
			<div className="space-x-4">
				<NavLinks
					links={links}
					linkActiveState={linkActiveState}
					linkDefaultState={linkDefaultState}
				/>
			</div>
			<p className="text-sm text-zinc-500">
				© 2024 Dinesh Haribabu. All rights reserved.
			</p>
		</footer>
	);
};

export default Footer;
