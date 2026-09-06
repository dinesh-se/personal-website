export default function Loading() {
	return (
		<>
			<section className="grid gap-10 pt-16 pb-12 md:grid-cols-[1fr_auto] md:items-center">
				<div className="space-y-6">
					<p className="text-base font-medium tracking-[0.2em] text-stone-500 uppercase dark:text-stone-400">
						Hello, I am
					</p>
					<span className="inline-block h-14 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<p className="max-w-2xl">
						<span className="inline-block h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<span className="mt-2 block h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					</p>
				</div>
				<div className="mx-auto h-48 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 md:h-64 md:w-64" />
			</section>

			<section className="py-16">
				<span className="inline-block h-9 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				<div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
					<div className="space-y-4">
						{[1, 2, 3, 4].map((i) => (
							<span
								key={i}
								className="block h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"
							/>
						))}
					</div>
					<div className="h-fit rounded-2xl border border-stone-200 p-6 dark:border-stone-800">
						{[1, 2, 3, 4].map((i) => (
							<span
								key={i}
								className="mt-3 block h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"
							/>
						))}
					</div>
				</div>
			</section>

			<section className="py-16">
				<span className="inline-block h-9 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
		</>
	);
}
