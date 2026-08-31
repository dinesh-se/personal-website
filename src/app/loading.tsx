export default function Loading() {
	return (
		<>
			<p className="pb-4 text-3xl">
				<span className="inline-block h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</p>
			<h1 className="pb-4 text-5xl font-bold">
				<span className="inline-block h-14 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</h1>
			<p className="max-w-2xl">
				<span className="inline-block h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				<span className="mt-2 block h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</p>
			<div className="mt-6 flex items-center gap-5">
				<span className="inline-block h-9 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
				<span className="inline-block h-9 w-28 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
			</div>
			<p className="mt-6">
				<span className="inline-block h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</p>

			<section className="mt-16">
				<span className="mb-8 inline-block h-7 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="w-full overflow-hidden rounded-lg p-4 shadow-lg bg-neutral-300 dark:bg-slate-900"
						>
							<span className="block h-5 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							<span className="mt-3 block h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							<span className="mt-2 block h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						</div>
					))}
				</div>
			</section>

			<section className="mt-16">
				<div className="rounded-2xl border border-zinc-700/40 p-6">
					<div className="flex space-x-4">
						<span className="inline-block h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<span className="inline-block h-6 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					</div>
					<div className="mt-6 space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex w-full space-x-4">
								<span className="inline-block h-10 w-10 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
								<div className="flex flex-1 flex-col space-y-2">
									<span className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
									<span className="h-3 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
