import Link from "next/link";

import { RepoUI } from "../types/github";

const ProjectCard = ({
  name,
  description,
  href,
  language
}: RepoUI) => {
  return (
    <Link className="bg-neutral-300 dark:bg-slate-900 rounded-md overflow-hidden p-6" href={href}>
      <h2 className="font-semibold mb-2 text-ellipsis text-nowrap overflow-hidden">{name}</h2>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="mt-4 text-sm">
        <span className="font-semibold">Tech:&nbsp;</span>
        {language}
      </p>
    </Link>
  )
}

export default ProjectCard;
