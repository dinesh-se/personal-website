export default function Loading() {
	return (
		<>
			<h1 className="text-3xl">
				<span className="inline-block h-9 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</h1>
			<p className="mt-4">
				<span className="inline-block h-5 w-80 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</p>
			<div className="sm:mx-16 md:mx-24 lg:mx-32 grid grid-cols-1 gap-4 pb-6 pt-4">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="w-full rounded overflow-hidden shadow-lg p-4 bg-neutral-300 dark:bg-slate-900"
					>
						<span className="mb-2 block h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<span className="block h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<div className="mt-4 flex flex-row text-sm">
							<span className="inline-block h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							<span className="ml-4 inline-block h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						</div>
					</div>
				))}
			</div>
		</>
	);
}
