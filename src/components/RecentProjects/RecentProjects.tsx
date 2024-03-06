import Link from 'next/link';

// import { useEffect, useState } from 'react';
import { getRepos } from '@api/github';

import IconCode from '@root/public/assets/code.svg';

// import { Repo } from '@types';

const RecentProjects = async () => {
	// const [repos, setRepos] = useState<Repo[]>([]);

	// useEffect(() => {
	// 	fetchData();
	// }, []);

	// const fetchData = async () => {
	// 	const params = {
	// 		per_page: '3',
	// 	};
	// 	const repos = await getRepos(params);

	// 	setRepos(repos);
	// };

	const params = {
		per_page: '3',
	};
	const repos = await getRepos(params);

	return (
		<>
			<h3 className="mb-10 flex space-x-4 font-semibold tracking-wider">
				<IconCode className="svg-icon h-8 w-8" />
				<span className="text-2xl">Recent Works</span>
			</h3>
			<div className="flex flex-col space-y-10">
				{repos.map(
					({ node_id: nodeId, name, html_url: htmlUrl, description }) => (
						<article className="group relative flex flex-col" key={nodeId}>
							<h2 className="mb-3 font-semibold tracking-wider text-zinc-100">
								<div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-neutral-200 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50"></div>
								<Link
									className="relative z-10 text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
									href={htmlUrl}
									target="_blank"
								>
									{name}
								</Link>
							</h2>
							<p className="relative z-10 text-sm text-zinc-500 dark:text-zinc-400">
								{description}
							</p>
						</article>
					)
				)}
			</div>
		</>
	);
};

export default RecentProjects;
