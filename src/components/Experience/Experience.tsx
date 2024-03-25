import Image from 'next/image';

import IconBriefcase from '@root/public/assets/briefcase.svg';

import { Experience as ExperienceType } from '@types';

const Experience = ({ organizations }: ExperienceType) => {
	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString('en', {
			year: 'numeric',
			month: 'short',
		});

	return (
		<div className="rounded-2xl border border-zinc-700/40 p-6">
			<h4 className="flex space-x-4 font-semibold tracking-wider">
				<IconBriefcase className="svg-icon h-6 w-6" />
				<span>Experience</span>
			</h4>
			<div className="mt-6 space-y-4">
				{organizations.map(({ orgName, orgLogo, title, from, to }) => (
					<div
						className="flex w-full space-x-4"
						key={`${orgName}-${from}-${to}`}
					>
						<div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-white shadow-md dark:border-zinc-500">
							<Image
								src={orgLogo.url}
								alt={`${orgName} Logo`}
								className="h-auto w-auto object-cover text-transparent"
								width="40"
								height="40"
							/>
						</div>
						<div className="flex flex-1 flex-col">
							<h4 className="font-semibold tracking-wider">{orgName}</h4>
							<div className="flex w-full flex-wrap justify-start text-sm text-zinc-400 sm:justify-between sm:space-x-4">
								<p className="text-sm">{title}</p>
								<div className="text-sm">
									<time dateTime="2023-05-25T00:00:00.000Z">
										{formatDate(from)}
									</time>
									<span aria-hidden="true"> — </span>
									{to ? (
										<time dateTime="2024-01-06T00:01:17.965Z">
											{formatDate(to)}
										</time>
									) : (
										<span>Present</span>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			<a
				className="mt-6 flex cursor-pointer
          items-center
          justify-center rounded-md
          bg-gray-300 px-3 py-2
          text-sm
          font-semibold transition hover:bg-gray-500
           hover:text-gray-100 focus:ring active:ring
           dark:bg-zinc-800/50
           dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
				href="https://link.dineshharibabu.in/resume"
			>
				Download Resume
			</a>
		</div>
	);
};

export default Experience;
