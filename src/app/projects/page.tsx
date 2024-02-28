import Image from "next/image";

import { getRepos } from "@api/github";
import ProjectCard from "@components/ProjectCard";

export default async function Projects() {
  const params = {
    since: new Date('21 March 2021').toISOString()
  };
  const repos = await getRepos(params);

  return (
    <>
      <h1 className="text-3xl">GitHub Projects</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-6">
        {repos.map(({node_id: nodeId, name, description, html_url: htmlUrl, language}) => (
          <ProjectCard
            key={nodeId}
            name={name}
            description={description}
            href={htmlUrl}
            language={language}
          />
        ))}
      </section>
      <section className="flex justify-center px-4 py-8">
        <p className="md:max-w-xl text-center pb-6">
          To know more about the projects that I have worked on in various organizations, please reach out to me.
        </p>
      </section>
    </>
  );
}
