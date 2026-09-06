'use cache';
import type { RichTextContent } from '@graphcms/rich-text-types';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';

import { getBlogFeed } from '@api/blog';
import { getProfile } from '@api/graphql';

import { About } from '@components/About';
import { Blog } from '@components/Blog';
import { Contact } from '@components/Contact';
import { Hero } from '@components/Hero';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Dinesh Haribabu',
		description:
			'Frontend by trade, architect by instinct. I build fast, accessible software — and run my own AI at the edge of what’s next.',
		authors: {
			name: 'Dinesh Haribabu',
			url: 'https://dineshharibabu.in/',
		},
	};
}

export default async function Home() {
	cacheLife('days');

	// Graceful fallback: if the CMS fetch fails, render the page with empty
	// values rather than crashing.
	let summary = '';
	let interests: string[] = [];
	let displayPictureUrl = '';
	let moreDetails: RichTextContent = { children: [] };
	let contact = { linkedin: '', github: '', email: '' };

	const userResult = await getProfile();
	if (userResult.success) {
		const {
			summary: s,
			interests: i,
			displayPicture,
			moreDetails: md,
			contactDetail,
		} = userResult.data.profile;
		const {
			email,
			socialMedia: { linkedin, github },
		} = contactDetail;
		summary = s;
		interests = i ?? [];
		displayPictureUrl = displayPicture?.url ?? '';
		moreDetails = md?.raw ?? { children: [] };
		contact = { linkedin, github, email };
	}

	// Cached blog feed. Up to 3 posts shown on home; the "View all" link
	// appears only when there are more than 3.
	const feed = await getBlogFeed();
	const posts = feed.posts.slice(0, 3);

	return (
		<div className="mx-auto max-w-5xl px-4 sm:px-6">
			<Hero displayPictureUrl={displayPictureUrl} summary={summary} />

			<About moreDetails={moreDetails} interests={interests} />

			<Blog posts={posts} total={feed.total} />

			<section id="contact" aria-label="Contact" className="py-16">
				<h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
					Contact
				</h2>
				<div className="mt-8 flex flex-wrap items-center gap-6">
					<a
						className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 focus:ring dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300"
						href="https://link.dineshharibabu.in/resume"
						target="_blank"
						rel="noreferrer"
					>
						Download Resume
					</a>
					<Contact
						linkedin={contact.linkedin}
						github={contact.github}
						email={contact.email}
					/>
				</div>
			</section>
		</div>
	);
}
