import Link from 'next/link';

export default async function Uses() {
	const workstationItems = [
		{
			item: 'Macbook Air 2015',
			comment:
				'I love working with this. Still going strong. When the time comes, I would love to upgrade to a Macbook Pro with SSD and a M series chip.',
		},
		{
			item: 'Dual Monitors',
			comment:
				'A simple two 27 inch Dell monitors setup. One for the IDE and another one for all other apps most of the times.',
		},
		{
			item: 'Wireless Keyboard & Mouse',
			comment:
				'I prefer clutter free working station. Hence wireless is an optimal choice. I use Microsoft All-in-One Keyboard and Trust Primo Mosue for mouse heavy tasks. And, Fellowes wrist and mouse pad for an ergonomic setup.',
		},
		{
			item: 'Sit-stand desk & Chair',
			comment:
				"This is one of the best investments I made for an ergonomic setup since I had some issues in the past. I use Gostand's The Advance S2 desk and a regular revolving office chair with no armreset.",
		},
	];

	const software = [
		{
			name: 'Visual Studio Code',
			comment:
				'Go to IDE for any programming tasks. Love the extensions ecosystem which improves producivity and makes lives easier.',
		},
		{
			name: 'Google Chrome',
			comment:
				'Primary browser for any browsing and development activities. I love the improved debugging capabilities for both JavaScript and styles.',
		},
		{
			name: 'ResponsivelyApp',
			comment:
				"Quickly helps to test any webpage for it's responsiveness in various viewports.",
		},
		{
			name: 'iTerm2 terminal',
			comment:
				'Coupled with plugins for theming and auto-completion makes a neat layout which makes me feel like a Hackerman.',
		},
		{
			name: 'Microsoft To Do',
			comment:
				"A simple todo'ist to organize my day-to-day tasks for both work & life. Sometimes, I prefer going old-school way of taking notes.",
		},
	];

	return (
		<>
			<h1 className="text-3xl">Uses</h1>
			<p className="mt-4">
				Inspired by&nbsp;
				<Link
					className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
					href="https://wesbos.com/"
				>
					Wes Bos&apos;s&nbsp;
				</Link>
				<Link
					className="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
					href="https://uses.tech"
				>
					https://uses.tech
				</Link>
				, here is the list of tools and technologies I use to keep myself
				productive and for a plesant working environment.
			</p>
			<section className="mt-8 flex flex-col sm:flex-row">
				<h2 className="min-w-[150px] text-2xl">Workstation</h2>
				<ul className="flex-auto pt-8">
					{workstationItems.map(({ item, comment }) => (
						<li className="my-4 flex" key={item}>
							<div className="mr-4">-</div>
							<div>
								<p className="mb-2 font-bold">{item}</p>
								<p>{comment}</p>
							</div>
						</li>
					))}
				</ul>
			</section>
			<section className="mt-8 flex flex-col sm:flex-row">
				<h2 className="min-w-[150px] text-2xl">Software</h2>
				<ul className="flex-auto pt-8">
					{software.map(({ name, comment }) => (
						<li className="my-4 flex" key={name}>
							<div className="mr-4">-</div>
							<div>
								<p className="mb-2 font-bold">{name}</p>
								<p>{comment}</p>
							</div>
						</li>
					))}
				</ul>
			</section>
		</>
	);
}
