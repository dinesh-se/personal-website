import Link from 'next/link';

import { getUser } from '@api/graphql';

import Contact from '@components/Contact';
import Experience from '@components/Experience';
import RecentProjects from '@components/RecentProjects';

import { Author } from '@types';

export default async function Home() {
	const {
		profile: {
			summary,
			contactDetail: {
				eMail,
				socialMedia: { linkedin, github },
			},
			experience: { organizations },
		},
	}: Author = await getUser();

	return (
		<>
			<p className="pb-4 text-3xl">
				<span className="pr-2" aria-hidden="true">
					👋
				</span>
				Hello, I am
			</p>
			<h1 className="pb-4 text-5xl font-bold text-transparent">
				<span className="bg-gradient-to-r from-emerald-400 via-sky-300 to-cyan-500 bg-clip-text">
					Dinesh Haribabu
				</span>
			</h1>
			<h2>{summary}</h2>
			<p className="mt-2">
				<Link
					className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
					href="/about"
				>
					Click here
				</Link>
				&nbsp;to learn more about me.
			</p>
			<section className="pt-3">
				<Contact linkedin={linkedin} github={github} eMail={eMail} />
			</section>
			<section className="mt-16 flex flex-col justify-between max-lg:space-y-8 lg:flex-row lg:space-x-16">
				<div className="flex-1">
					<RecentProjects></RecentProjects>
				</div>
				<div className="space-y-10">
					<Experience organizations={organizations} />
				</div>
			</section>
		</>
	);
}
