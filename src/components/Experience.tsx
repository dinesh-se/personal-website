import Image from 'next/image';

import { Experience as ExperienceType } from '@types';
import IconBriefcase from '@root/public/assets/briefcase.svg';

const Experience = ({
  organizations
}: ExperienceType) => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en', { year: 'numeric', month: 'short' });

  return (
    <div className="p-6 rounded-2xl border border-zinc-700/40">
      <h4 className="flex font-semibold tracking-wider space-x-4">
        <IconBriefcase className="h-6 w-6 svg-icon" />
        <span>Experience</span> 
      </h4>
      <div className="mt-6 space-y-4">
        {organizations.map(({
          orgName, orgLogo, title, from, to
        }) => (
          <div className="flex w-full space-x-4" key={`${orgName}-${from}-${to}`}>
            <div className="h-10 w-10 relative flex items-center overflow-hidden justify-center bg-white shadow-md border border-slate-300 dark:border-zinc-500 rounded-md"> 
              <Image 
                src={orgLogo.url} 
                alt={`${orgName} Logo`} 
                className="h-auto w-auto object-cover text-transparent" 
                width="40" 
                height="40"
              />
            </div>
            <div className="flex flex-col flex-1">
              <h4 className="font-semibold tracking-wider">{orgName}</h4>
              <div className="flex flex-wrap justify-start sm:justify-between w-full sm:space-x-4 text-sm text-zinc-400">
                <p className="text-sm">{title}</p>
                <div className="text-sm">
                  <time dateTime="2023-05-25T00:00:00.000Z">{formatDate(from)}</time> 
                  <span aria-hidden="true"> — </span>
                  { to ? <time dateTime="2024-01-06T00:01:17.965Z">{formatDate(to)}</time> : <span>Present</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a 
        className="flex items-center justify-center 
          rounded-md 
          text-sm font-semibold 
          mt-6 py-2 px-3 
          transition 
          bg-gray-300 hover:bg-gray-500 hover:text-gray-100
           dark:bg-zinc-800/50 dark:hover:text-zinc-50 dark:hover:bg-zinc-800
           cursor-pointer 
           active:ring focus:ring" 
        href="https://drive.google.com/file/d/13xI1xgpGBtYOGV9nOr0nplmb88STtI6C/view?usp=sharing">
        Download Resume
      </a> 
    </div>
  )
}

export default Experience;
