import { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
		},
		sitemap: 'https://dineshharibabu.in/sitemap.xml',
	};
};

export default robots;
