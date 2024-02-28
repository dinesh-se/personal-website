import NavLinks from '@components/NavLinks';
import { Link as LinkType } from '@types';

const Footer = () => {
  const linkActiveState = 'font-semibold';
  const linkDefaultState = 'text-neutral-500 hover:text-slate-700 dark:hover:text-white';
  const links: LinkType[] = [
    {
      label: 'Home',
      href: '/'
    },
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
    <footer className="flex flex-col sm:flex-row gap-y-4 justify-between items-center
      dark:text-slate-200 text-sm
      max-w-7xl m-auto p-12 
      border-t border-slate-200 dark:border-slate-700"
    >
      <div className="space-x-4"> 
        <NavLinks 
          links={links} 
          linkActiveState={linkActiveState}
          linkDefaultState={linkDefaultState}
        />
      </div>
      <p className="text-zinc-500 text-sm">
        © 2024 Dinesh Haribabu. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
