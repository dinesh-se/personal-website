import Link from 'next/link';

import { RepoUI } from '@types';

const ProjectCard = ({ name, description, href, primaryLanguage }: RepoUI) => (
	<Link
		className="overflow-hidden rounded-md bg-neutral-300 p-6 dark:bg-slate-900"
		href={href}
	>
		<h2 className="mb-2 overflow-hidden text-ellipsis text-nowrap font-semibold">
			{name}
		</h2>
		<p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
		{primaryLanguage && (
			<p className="mt-4 text-sm flex items-center">
				<span>{primaryLanguage.name}</span>
				<span
					className="mr-2 w-4 h-4 rounded-full order-first"
					style={{ backgroundColor: primaryLanguage.color }}
				/>
			</p>
		)}
	</Link>
);

export default ProjectCard;
