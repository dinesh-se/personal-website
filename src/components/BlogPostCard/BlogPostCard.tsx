import {
	ChatBubbleOvalLeftIcon,
	EyeIcon,
	HeartIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';

import { BlogPostUI } from '@types';

const BlogPostCard: React.FC<BlogPostUI> = ({
	title,
	description,
	date,
	url,
	commentsCount,
	reactionsCount,
	pageViewsCount,
}) => {
	return (
		<div className="w-full rounded overflow-hidden shadow-lg p-4 bg-neutral-300 dark:bg-slate-900">
			<Link href={url} target="_blank">
				<h2 className="font-semibold text-xl mb-2">{title}</h2>
				<p className="text-gray-600 dark:text-gray-300 text-base">
					{description}
				</p>
				<div className="flex flex-row text-gray-500 text-sm mt-4">
					<span className="flex gap-4">
						<span className="flex gap-1 items-center">
							<HeartIcon className="inline w-4 h-4" />
							{reactionsCount}
						</span>
						<span className="flex gap-1 items-center">
							<ChatBubbleOvalLeftIcon className="inline w-4 h-4" />
							{commentsCount}
						</span>
						<span className="flex gap-1 items-center">
							<EyeIcon className="inline w-4 h-4" />
							{pageViewsCount}
						</span>
					</span>
					<span className="ml-4">
						Published at: {date.toLocaleDateString('en-IN')}
					</span>
				</div>
			</Link>
		</div>
	);
};

export default BlogPostCard;
