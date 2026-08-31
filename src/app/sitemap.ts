import { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
	const routes: string[] = ['', '/about', '/blog', '/uses'];

	return routes.map((path) => ({
		url: `https://dineshharibabu.in${path}`,
		lastModified: new Date(),
		changeFrequency: 'monthly',
		priority: path ? 0.8 : 1,
	}));
};

export default sitemap;
