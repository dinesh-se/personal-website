import { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
	return [
		{
			url: 'https://dineshharibabu.in',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
		},
	];
};

export default sitemap;
