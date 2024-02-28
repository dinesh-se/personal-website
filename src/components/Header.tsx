import Link from 'next/link';

import NavLinks from '@components/NavLinks';
import { Link as LinkType } from '@types';
import Logo from '@root/public/assets/logo.svg';

const Header = () => {
  const linkActiveState = 'bg-stone-300 dark:bg-gray-900';
  const linkDefaultState = 'hover:text-black dark:hover:bg-gray-700 dark:hover:text-white';
  const otherStyleClasses = 'rounded-md px-3 py-2 text-sm font-medium';
  const links: LinkType[] = [
    {
      label: 'About me',
      href: '/about'
    },
    {
      label: 'Projects',
      href: '/projects'
    },
    {
      label: 'Uses',
      href: '/uses'
    }
  ];

  return (
    <nav className="p-4">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:justify-start">
            <div className="flex flex-1 items-center">
              <Link href="/">
                <Logo className="w-16 h-16 svg-icon" />
              </Link>
            </div>
            <div className="sm:flex-auto">
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
    </nav>
  );
};

export default Header;

 
