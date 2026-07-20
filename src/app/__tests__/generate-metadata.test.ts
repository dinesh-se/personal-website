import { generateMetadata as aboutGenerateMetadata } from '../about/page';
import { generateMetadata as blogGenerateMetadata } from '../blog/page';
import { generateMetadata as rootGenerateMetadata } from '../metadata';
import { generateMetadata as homeGenerateMetadata } from '../page';
import { generateMetadata as projectsGenerateMetadata } from '../projects/page';
import { generateMetadata as usesGenerateMetadata } from '../uses/page';

describe('generateMetadata', () => {
	describe('Root layout generateMetadata', () => {
		it('returns metadata with correct title', async () => {
			const metadata = await rootGenerateMetadata();
			expect(metadata.title).toBe('Dinesh Haribabu');
		});

		it('returns metadata with correct description', async () => {
			const metadata = await rootGenerateMetadata();
			expect(metadata.description).toBe(
				'A front-end web developer focused on crafting clean and intuitive interfaces providing better UX.'
			);
		});

		it('returns metadata with correct author', async () => {
			const metadata = await rootGenerateMetadata();
			expect(metadata.authors).toEqual({
				name: 'Dinesh Haribabu',
				url: 'https://dineshharibabu.in/',
			});
		});
	});

	describe('Home page generateMetadata', () => {
		it('returns metadata with title "Dinesh Haribabu"', async () => {
			const metadata = await homeGenerateMetadata();
			expect(metadata.title).toBe('Dinesh Haribabu');
		});

		it('returns metadata with description', async () => {
			const metadata = await homeGenerateMetadata();
			expect(metadata.description).toBeTruthy();
		});

		it('returns metadata with author information', async () => {
			const metadata = await homeGenerateMetadata();
			expect(metadata.authors).toBeTruthy();
		});
	});

	describe('About page generateMetadata', () => {
		it('returns metadata with title "About me — Dinesh Haribabu"', async () => {
			const metadata = await aboutGenerateMetadata();
			expect(metadata.title).toBe('About me — Dinesh Haribabu');
		});

		it('returns metadata with description', async () => {
			const metadata = await aboutGenerateMetadata();
			expect(metadata.description).toBeTruthy();
		});

		it('returns metadata with author information', async () => {
			const metadata = await aboutGenerateMetadata();
			expect(metadata.authors).toEqual({
				name: 'Dinesh Haribabu',
				url: 'https://dineshharibabu.in/',
			});
		});
	});

	describe('Projects page generateMetadata', () => {
		it('returns metadata with title "Projects — Dinesh Haribabu"', async () => {
			const metadata = await projectsGenerateMetadata();
			expect(metadata.title).toBe('Projects — Dinesh Haribabu');
		});

		it('returns metadata with description', async () => {
			const metadata = await projectsGenerateMetadata();
			expect(metadata.description).toBeTruthy();
		});

		it('returns metadata with author information', async () => {
			const metadata = await projectsGenerateMetadata();
			expect(metadata.authors).toEqual({
				name: 'Dinesh Haribabu',
				url: 'https://dineshharibabu.in/',
			});
		});
	});

	describe('Blog page generateMetadata', () => {
		it('returns metadata with title "Blog — Dinesh Haribabu"', async () => {
			const metadata = await blogGenerateMetadata();
			expect(metadata.title).toBe('Blog — Dinesh Haribabu');
		});

		it('returns metadata with description', async () => {
			const metadata = await blogGenerateMetadata();
			expect(metadata.description).toBeTruthy();
		});

		it('returns metadata with author information', async () => {
			const metadata = await blogGenerateMetadata();
			expect(metadata.authors).toEqual({
				name: 'Dinesh Haribabu',
				url: 'https://dineshharibabu.in/',
			});
		});
	});

	describe('Uses page generateMetadata', () => {
		it('returns metadata with title "Uses — Dinesh Haribabu"', async () => {
			const metadata = await usesGenerateMetadata();
			expect(metadata.title).toBe('Uses — Dinesh Haribabu');
		});

		it('returns metadata with description', async () => {
			const metadata = await usesGenerateMetadata();
			expect(metadata.description).toBeTruthy();
		});

		it('returns metadata with author information', async () => {
			const metadata = await usesGenerateMetadata();
			expect(metadata.authors).toEqual({
				name: 'Dinesh Haribabu',
				url: 'https://dineshharibabu.in/',
			});
		});
	});

	describe('All routes have page-specific titles', () => {
		it('has unique titles for all 5 routes', async () => {
			const metas = await Promise.all([
				homeGenerateMetadata(),
				aboutGenerateMetadata(),
				projectsGenerateMetadata(),
				blogGenerateMetadata(),
				usesGenerateMetadata(),
			]);
			const titles = metas.map((m) => m.title);
			const unique = new Set(titles);
			expect(unique.size).toBe(5);
		});

		it('all titles contain "Dinesh Haribabu"', async () => {
			const metas = await Promise.all([
				homeGenerateMetadata(),
				aboutGenerateMetadata(),
				projectsGenerateMetadata(),
				blogGenerateMetadata(),
				usesGenerateMetadata(),
			]);
			for (const m of metas) {
				expect(m.title).toContain('Dinesh Haribabu');
			}
		});
	});
});
