import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavLinks as NavLinksType } from '@types';

const NavLinks = ({
	links,
	linkActiveState,
	linkDefaultState,
	otherStyleClasses,
}: NavLinksType) => {
	const pathname = usePathname();

	return (
		<>
			{links.map(({ label, href }) => (
				<Link
					key={href}
					href={href}
					className={clsx(
						otherStyleClasses,
						pathname === href ? linkActiveState : linkDefaultState
					)}
				>
					{label}
				</Link>
			))}
		</>
	);
};

export default NavLinks;
