export default function Loading() {
	return (
		<>
			<h1 className="text-3xl">
				<span className="inline-block h-9 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</h1>
			<section className="grid grid-cols-1 gap-4 pb-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="overflow-hidden rounded-md bg-neutral-300 p-6 dark:bg-slate-900"
					>
						<span className="mb-2 block h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<span className="block h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<div className="mt-4 flex items-center">
							<span className="mr-2 h-4 w-4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
							<span className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						</div>
					</div>
				))}
			</section>
			<section className="flex justify-center px-4 py-8">
				<div className="md:max-w-xl">
					<span className="block h-5 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<span className="mt-2 block h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				</div>
			</section>
		</>
	);
}
