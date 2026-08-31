'use cache';
import type { DefaultElementProps } from '@graphcms/rich-text-react-renderer';
import { RichText } from '@graphcms/rich-text-react-renderer';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import Image from 'next/image';

import { getMoreDetails } from '@api/graphql';

import { Contact } from '@components/Contact';

import LogoAngular from '@root/public/assets/tech/angular.svg';
import LogoCypress from '@root/public/assets/tech/cypress.svg';
import LogoHygraph from '@root/public/assets/tech/hygraph.svg';
import LogoNext from '@root/public/assets/tech/nextjs.svg';
import LogoReact from '@root/public/assets/tech/react.svg';
import LogoRxJS from '@root/public/assets/tech/rxjs.svg';
import LogoStorybook from '@root/public/assets/tech/storybook.svg';
import LogoTailwindCSS from '@root/public/assets/tech/tailwindcss.svg';
import LogoTS from '@root/public/assets/tech/typescript.svg';

import { Author } from '@types';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'About me — Dinesh Haribabu',
		description:
			'More about me — my background, experience, and the technologies I work with.',
		authors: {
			name: 'Dinesh Haribabu',
			url: 'https://dineshharibabu.in/',
		},
	};
}

async function getPageData() {
	const result = await getMoreDetails();

	if (!result.success) {
		return {
			displayPictureUrl: '',
			richContent: [],
			email: '',
			linkedin: '',
			github: '',
		};
	}

	const {
		profile: {
			displayPicture: { url },
			moreDetails: { raw },
			contactDetail: {
				email,
				socialMedia: { linkedin, github },
			},
		},
	}: Author = result.data;

	return {
		displayPictureUrl: url,
		richContent: raw,
		email,
		linkedin,
		github,
	};
}

export default async function About() {
	cacheLife('days');

	const { displayPictureUrl, richContent, email, linkedin, github } =
		await getPageData();

	return (
		<>
			<h1 className="text-3xl">A little more about me!</h1>
			<section className="pb-6 pt-4 md:flex">
				<section className="space-y-4 pr-8 leading-relaxed tracking-wide md:w-3/5">
					<RichText
						content={richContent}
						renderers={{
							h1: ({ children }: DefaultElementProps) => <h2>{children}</h2>,
							h2: ({ children }: DefaultElementProps) => <h3>{children}</h3>,
							h3: ({ children }: DefaultElementProps) => <h4>{children}</h4>,
							h4: ({ children }: DefaultElementProps) => <h5>{children}</h5>,
							h5: ({ children }: DefaultElementProps) => <h6>{children}</h6>,
							h6: ({ children }: DefaultElementProps) => <h6>{children}</h6>,
							p: ({ children }: DefaultElementProps) => <p>{children}</p>,
							code: ({ children }: DefaultElementProps) => (
								<code className="text-amber-700 dark:text-amber-500">
									{children}
								</code>
							),
							code_block: ({ children }: DefaultElementProps) => (
								<pre className="overflow-x-auto whitespace-pre">
									<code>{children}</code>
								</pre>
							),
						}}
					/>
				</section>
				<section className="align-center flex flex-col justify-center md:flex-1 mt-4">
					<Image
						className="rounded-lg md:origin-bottom md:rotate-3"
						src={displayPictureUrl}
						width="360"
						height="360"
						alt="Dinesh Haribabu"
					/>
					<Contact linkedin={linkedin} github={github} email={email} />
				</section>
			</section>
			<section
				className="mt-12 rounded-2xl border border-zinc-700/40 bg-neutral-200/60 p-6 dark:bg-zinc-800/50"
				aria-label="Self-hosted AI stack"
			>
				<h2 className="mb-3 flex items-center space-x-4 font-semibold tracking-wider">
					<span>Self-hosted AI stack</span>
				</h2>
				<p className="max-w-3xl leading-relaxed text-zinc-700 dark:text-zinc-300">
					Away from the browser I run my own local AI stack — a 128&nbsp;GB AMD
					Strix Halo mini-PC serving local models for coding, automation, and my
					always-on personal assistant. Fully self-hosted; configs and
					benchmarks live in the repo.
				</p>
				<a
					className="mt-3 inline-block text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
					href="https://github.com/dinesh-se/strix-halo-llm-stack"
					target="_blank"
					rel="noreferrer"
				>
					View the repo →
				</a>
			</section>
			<section className="-mx-8 bg-neutral-200 px-4 py-8 dark:bg-gray-950">
				<h2 className="headline mt-10 text-center text-xl md:text-2xl lg:text-3xl">
					Some of my favorite&nbsp;
					<span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">
						technologies
					</span>
					&nbsp;to work with
				</h2>
				<div className="mx-auto mb-16 mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-x-16 gap-y-8">
					<LogoReact
						className="w-12 sm:w-16"
						aria-label="React.js"
						title="React"
					/>
					<LogoAngular className="w-16 sm:w-20" aria-label="Angular" />
					<LogoTS className="w-10 sm:w-14" aria-label="TypeScript" />
					<LogoRxJS className="w-12 sm:w-16" aria-label="RxJS" />
					<LogoNext className="w-28 sm:w-36" aria-label="Next.js" />
					<LogoTailwindCSS className="w-12 sm:w-16" aria-label="Tailwind CSS" />
					<LogoHygraph className="w-28 md:w-36" aria-label="Hygraph" />
					<LogoStorybook className="w-32 md:w-40" aria-label="Storybook" />
					<LogoCypress className="w-28 sm:w-36" aria-label="Cypress" />
				</div>
			</section>
		</>
	);
}
