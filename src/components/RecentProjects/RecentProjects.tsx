import Link from 'next/link';

import IconCode from '@root/public/assets/code.svg';

import { Projects } from '@types';

const RecentProjects = ({ projects }: Projects) => {
	return (
		<>
			<h3 className="mb-10 flex space-x-4 font-semibold tracking-wider">
				<IconCode className="svg-icon h-8 w-8" />
				<span className="text-2xl">Recent Works</span>
			</h3>
			<div className="flex flex-col space-y-10">
				{projects.map(({ id, name, url, description }) => (
					<article className="group relative flex flex-col" key={id}>
						<h2 className="mb-3 font-semibold tracking-wider text-zinc-100">
							<div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-neutral-200 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50"></div>
							<Link
								className="relative z-10 text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
								href={url}
								target="_blank"
							>
								{name}
							</Link>
						</h2>
						<p className="relative z-10 text-sm text-zinc-500 dark:text-zinc-400">
							{description}
						</p>
					</article>
				))}
			</div>
		</>
	);
};

export default RecentProjects;
