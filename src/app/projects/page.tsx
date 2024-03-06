import { getRepos } from '@api/github';

import { ProjectCard } from '@components/ProjectCard';

export default async function Projects() {
	const params = {
		since: new Date('21 March 2021').toISOString(),
	};
	const repos = await getRepos(params);

	return (
		<>
			<h1 className="text-3xl">GitHub Projects</h1>
			<section className="grid grid-cols-1 gap-4 pb-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
				{repos.map(
					({
						node_id: nodeId,
						name,
						description,
						html_url: htmlUrl,
						language,
					}) => (
						<ProjectCard
							key={nodeId}
							name={name}
							description={description}
							href={htmlUrl}
							language={language}
						/>
					)
				)}
			</section>
			<section className="flex justify-center px-4 py-8">
				<p className="pb-6 text-center md:max-w-xl">
					To know more about the projects that I have worked on in various
					organizations, please reach out to me.
				</p>
			</section>
		</>
	);
}
