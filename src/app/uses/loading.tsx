export default function Loading() {
	return (
		<>
			<h1 className="text-3xl">
				<span className="inline-block h-9 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</h1>
			<p className="mt-4">
				<span className="inline-block h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				<span className="mt-1 block h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</p>
			{[1, 2, 3].map((section) => (
				<section key={section} className="mt-8 flex flex-col sm:flex-row">
					<span className="min-w-[150px] h-8 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<ul className="flex-auto pt-8">
						{[1, 2, 3].map((item) => (
							<li key={item} className="my-4 flex">
								<div className="mr-4">
									<span className="inline-block h-5 w-2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
								</div>
								<div className="space-y-2">
									<span className="block h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
									<span className="block h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
								</div>
							</li>
						))}
					</ul>
				</section>
			))}
		</>
	);
}
