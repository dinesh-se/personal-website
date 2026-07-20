export default function Loading() {
	return (
		<>
			<p className="pb-4 text-3xl">
				<span className="inline-block h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</p>
			<h1 className="pb-4 text-5xl font-bold">
				<span className="inline-block h-14 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</h1>
			<h2 className="mb-2">
				<span className="inline-block h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</h2>
			<p className="mt-2">
				<span className="inline-block h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</p>
			<section className="pt-3">
				<span className="inline-block h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</section>
			<section className="mt-16 flex flex-col justify-between max-lg:space-y-8 lg:flex-row lg:space-x-16">
				<div className="flex-1">
					<div className="mb-10 flex space-x-4">
						<span className="inline-block h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<span className="inline-block h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					</div>
					<div className="flex flex-col space-y-10">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex flex-col">
								<span className="mb-3 h-5 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
								<span className="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							</div>
						))}
					</div>
				</div>
				<div className="space-y-10">
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
						<div className="mt-6">
							<span className="inline-block h-9 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
