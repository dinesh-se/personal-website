'use cache';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import Link from 'next/link';

import { getBlogFeed } from '@api/blog';
import { getUser } from '@api/graphql';

import { BlogPostCard } from '@components/BlogPostCard';
import { Contact } from '@components/Contact';
import { Experience } from '@components/Experience';

const HERO_SUBLINE =
	'Frontend by trade, architect by instinct — I build fast, accessible web interfaces, and run a self-hosted AI stack that works alongside me.';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Dinesh Haribabu',
		description:
			'A front-end web developer focused on crafting clean and intuitive interfaces providing better UX.',
		authors: {
			name: 'Dinesh Haribabu',
			url: 'https://dineshharibabu.in/',
		},
	};
}

export default async function Home() {
	cacheLife('days');

	// Graceful fallback: if the CMS fetch fails, render the page with empty
	// contact/experience values rather than crashing.
	let contact = { linkedin: '', github: '', email: '' };
	let organizations: {
		orgName: string;
		title: string;
		from: string;
		to?: string;
		orgLogo: { url: string };
	}[] = [];

	const userResult = await getUser();
	if (userResult.success) {
		const { contactDetail, experience } = userResult.data.profile;
		const {
			email,
			socialMedia: { linkedin, github },
		} = contactDetail;
		contact = { linkedin, github, email };
		organizations = experience.organizations;
	}

	// Cached blog feed (shared with the /blog page). Up to 3 posts shown on
	// home; the "View all posts" link appears only when there are more than 3.
	const feed = await getBlogFeed();
	const posts = feed.posts.slice(0, 3);

	return (
		<>
			<p className="pb-4 text-3xl">Hello, I am</p>
			<h1 className="pb-4 text-5xl font-bold text-transparent">
				<span className="bg-gradient-to-r from-emerald-400 via-sky-300 to-cyan-500 bg-clip-text">
					Dinesh Haribabu
				</span>
			</h1>
			<p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
				{HERO_SUBLINE}
			</p>

			<div className="mt-6 flex flex-wrap items-center gap-5">
				<a
					className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-400 via-sky-300 to-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-105 focus:ring"
					href="https://link.dineshharibabu.in/resume"
				>
					Download Resume
				</a>
				<section aria-label="Contact">
					<Contact
						linkedin={contact.linkedin}
						github={contact.github}
						email={contact.email}
					/>
				</section>
			</div>

			<p className="mt-6">
				<Link
					className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
					href="/about"
				>
					More about me
				</Link>
			</p>

			{feed.total > 0 && (
				<section className="mt-16">
					<h2 className="mb-8 flex items-center space-x-4 font-semibold tracking-wider">
						<span className="text-2xl">Latest from the blog</span>
					</h2>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{posts.map(({ id, ...rest }) => (
							<BlogPostCard key={id} {...rest} />
						))}
					</div>
					{feed.total > 3 && (
						<p className="mt-6">
							<Link
								className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
								href="/blog"
							>
								View all posts →
							</Link>
						</p>
					)}
				</section>
			)}

			<section className="mt-16">
				<Experience organizations={organizations} />
			</section>
		</>
	);
}
