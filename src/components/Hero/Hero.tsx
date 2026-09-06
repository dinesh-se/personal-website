import Image from 'next/image';

export interface HeroProps {
	displayPictureUrl: string;
	summary: string;
}

const Hero = ({ displayPictureUrl, summary }: HeroProps) => {
	return (
		<section
			id="hero"
			aria-label="Introduction"
			className="grid gap-10 pt-16 pb-12 md:grid-cols-[1fr_auto] md:items-center"
		>
			<div className="space-y-6">
				<p className="text-base font-medium tracking-[0.2em] text-stone-500 uppercase dark:text-stone-400">
					Hello, I am
				</p>
				<h1 className="text-5xl font-extrabold tracking-tight text-stone-900 sm:text-6xl dark:text-stone-50">
					Dinesh Haribabu
				</h1>
				<p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
					{summary}
				</p>
			</div>
			{displayPictureUrl && (
				<div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full ring-4 ring-stone-200 dark:ring-stone-800 md:h-64 md:w-64">
					<Image
						src={displayPictureUrl}
						alt="Dinesh Haribabu"
						className="object-cover"
						fill
						sizes="(max-width: 768px) 12rem, 16rem"
						priority
					/>
				</div>
			)}
		</section>
	);
};

export default Hero;
