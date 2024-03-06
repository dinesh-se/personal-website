import { getRepos } from '@api/graphql';

import { ProjectCard } from '@components/ProjectCard';

export default async function Projects() {
	const {
		profile: {
			githubRecentProjects: {
				repositories: { nodes: repos },
			},
		},
	} = await getRepos();

	return (
		<>
			<h1 className="text-3xl">GitHub Projects</h1>
			<section className="grid grid-cols-1 gap-4 pb-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
				{repos.map(({ id, name, description, url, primaryLanguage }) => (
					<ProjectCard
						key={id}
						name={name}
						description={description}
						href={url}
						primaryLanguage={primaryLanguage}
					/>
				))}
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
