import { generateMetadata as rootGenerateMetadata } from '../metadata';
import { generateMetadata as homeGenerateMetadata } from '../page';

describe('generateMetadata', () => {
	describe('Root layout generateMetadata', () => {
		it('returns metadata with correct title', async () => {
			const metadata = await rootGenerateMetadata();
			expect(metadata.title).toBe('Dinesh Haribabu');
		});

		it('returns metadata with correct description', async () => {
			const metadata = await rootGenerateMetadata();
			expect(metadata.description).toBe(
				'Frontend by trade, architect by instinct. I build fast, accessible software — and run my own AI at the edge of what’s next.'
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
});
