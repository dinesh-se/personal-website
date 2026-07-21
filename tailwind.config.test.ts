import config from './tailwind.config';

describe('tailwind.config', () => {
	it('uses media strategy for darkMode (follows OS preference only)', () => {
		expect(config.darkMode).toBe('media');
	});
});
