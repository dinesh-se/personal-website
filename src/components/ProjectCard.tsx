import Link from 'next/link';

import { RepoUI } from '@types';

const ProjectCard = ({ name, description, href, language }: RepoUI) => {
	return (
		<Link
			className="overflow-hidden rounded-md bg-neutral-300 p-6 dark:bg-slate-900"
			href={href}
		>
			<h2 className="mb-2 overflow-hidden text-ellipsis text-nowrap font-semibold">
				{name}
			</h2>
			<p className="text-sm text-gray-600">{description}</p>
			<p className="mt-4 text-sm">
				<span className="font-semibold">Tech:&nbsp;</span>
				{language}
			</p>
		</Link>
	);
};

export default ProjectCard;
