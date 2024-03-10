import Link from 'next/link';

import { getUses } from '@api/graphql';
import { Uses } from '@types';

export default async function Uses() {
	const uses: Uses[] = await getUses();

	return (
		<>
			<h1 className="text-3xl">Uses</h1>
			<p className="mt-4">
				This page draws inspiration from&nbsp;
				<Link
					className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
					href="https://uses.tech"
				>
					Wes Bos&apos;s Uses.Tech
				</Link>
				&nbsp;project, a collection of developer&apos;s setup, hardware and
				software.
			</p>
			{uses.map(({id, title, list}) => (
				<section className="mt-8 flex flex-col sm:flex-row" key={id}>	
					<h2 className="min-w-[150px] text-2xl">{title}</h2>
					<ul className="flex-auto pt-8">
						{list.map(({ id, name, description }) => (
							<li className="my-4 flex" key={id}>
								<div className="mr-4">-</div>
								<div>
									<p className="mb-2 font-bold">{name}</p>
									<p>{description}</p>
								</div>
							</li>
						))}
					</ul>
				</section>
			))}
		</>
	);
}
