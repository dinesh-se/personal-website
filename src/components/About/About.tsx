import type { DefaultElementProps } from '@graphcms/rich-text-react-renderer';
import { RichText } from '@graphcms/rich-text-react-renderer';
import type { RichTextContent } from '@graphcms/rich-text-types';

export interface AboutProps {
	moreDetails: RichTextContent;
	interests: string[];
}

const About = ({ moreDetails, interests }: AboutProps) => {
	return (
		<section id="about" aria-label="About" className="py-16">
			<h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
				About
			</h2>
			<div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
				<div className="space-y-4 leading-relaxed tracking-wide text-stone-600 dark:text-stone-300">
					<RichText
						content={moreDetails}
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
				</div>
				<Interests interests={interests} />
			</div>
		</section>
	);
};

const Interests = ({ interests }: { interests: string[] }) => {
	if (interests.length === 0) return null;

	return (
		<div
			className="h-fit rounded-2xl border border-stone-200 p-6 dark:border-stone-800"
			aria-label="Interests"
		>
			<h3 className="text-sm font-semibold tracking-[0.2em] text-stone-500 uppercase dark:text-stone-400">
				Interests
			</h3>
			<ul className="mt-4 space-y-3">
				{interests.map((interest) => (
					<li
						key={interest}
						className="text-sm leading-relaxed text-stone-600 dark:text-stone-300"
					>
						{interest}
					</li>
				))}
			</ul>
		</div>
	);
};

export default About;
