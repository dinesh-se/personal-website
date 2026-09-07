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
	// All personal metadata is sourced from the CMS (Hygraph). If the fetch
	// fails, fall back to empty metadata rather than hardcoding personal
	// values in the repo.
	const userResult = await getProfile();
	const profile = userResult.success ? userResult.data.profile : null;

	return {
		title: profile?.metaTitle || '',
		description: profile?.metaDescription || '',
		authors: profile?.metaAuthorName
			? {
					name: profile.metaAuthorName,
					url: profile.metaAuthorUrl,
				}
			: undefined,
	};
}

export default async function Home() {
	cacheLife('days');

	// Graceful fallback: if the CMS fetch fails, render the page with empty
	// values rather than crashing.
	let name = '';
	let summary = '';
	let interests: string[] = [];
	let displayPictureUrl = '';
	let moreDetails: RichTextContent = { children: [] };
	let resumeLink = '';
	let contact = { linkedin: '', github: '', email: '' };

	const userResult = await getProfile();
	if (userResult.success) {
		const {
			fullName,
			summary: s,
			interests: i,
			displayPicture,
			moreDetails: md,
			resumeLink: rl,
			contactDetail,
		} = userResult.data.profile;
		const {
			email,
			socialMedia: { linkedin, github },
		} = contactDetail;
		name = fullName;
		summary = s;
		interests = i ?? [];
		displayPictureUrl = displayPicture?.url ?? '';
		moreDetails = md?.raw ?? { children: [] };
		resumeLink = rl;
		contact = { linkedin, github, email };
	}

	// Cached blog feed. Up to 3 posts shown on home; the "View all" link
	// appears only when there are more than 3.
	const feed = await getBlogFeed();
	const posts = feed.posts.slice(0, 3);

	return (
		<div className="mx-auto max-w-5xl px-4 sm:px-6">
			<Hero
				displayPictureUrl={displayPictureUrl}
				name={name}
				summary={summary}
			/>

			<About moreDetails={moreDetails} interests={interests} />

			<Blog posts={posts} total={feed.total} />

			<section id="contact" aria-label="Contact" className="py-16">
				<h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
					Contact
				</h2>
				<div className="mt-8 flex flex-wrap items-center gap-6">
					{resumeLink && (
						<a
							className="inline-flex items-center rounded-md bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:from-sky-500 hover:via-indigo-500 hover:to-fuchsia-500 focus:ring dark:from-sky-500 dark:via-indigo-500 dark:to-fuchsia-500"
							href={resumeLink}
							target="_blank"
							rel="noreferrer"
						>
							Download Resume
						</a>
					)}
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
