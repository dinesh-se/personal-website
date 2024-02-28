'use client'

import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { NavLinks } from '../types/nav-links';

const NavLinks = ({
  links,
  linkActiveState,
  linkDefaultState,
  otherStyleClasses
}: NavLinks) => {
  const pathname = usePathname();

  return (
    <>
      {links.map(({label, href}) => (
        <Link 
          key={href}
          href={href} 
          className={clsx(otherStyleClasses, pathname === href ? linkActiveState : linkDefaultState)}>
          {label}
        </Link>
      ))}
    </>
  )
};

export default NavLinks;
