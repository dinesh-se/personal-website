export default function Loading() {
	return (
		<>
			<h1 className="text-3xl">
				<span className="inline-block h-9 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
			</h1>
			<section className="pb-6 pt-4 md:flex">
				<section className="space-y-4 pr-8 md:w-3/5">
					{[1, 2, 3].map((i) => (
						<p key={i}>
							<span className="inline-block h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						</p>
					))}
					{[1, 2].map((i) => (
						<p key={i}>
							<span className="inline-block h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						</p>
					))}
				</section>
				<section className="align-center mt-4 flex flex-col justify-center md:flex-1">
					<span className="inline-block h-[360px] w-[360px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
					<div className="mt-4">
						<span className="inline-block h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					</div>
				</section>
			</section>
			<section className="-mx-8 bg-neutral-200 px-4 py-8 dark:bg-gray-950">
				<h2 className="mt-10 text-center text-xl md:text-2xl lg:text-3xl">
					<span className="inline-block h-7 w-64 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
				</h2>
				<div className="mx-auto mb-16 mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-x-16 gap-y-8">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
						<span
							key={i}
							className="inline-block h-12 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600"
						/>
					))}
				</div>
			</section>
		</>
	);
}
