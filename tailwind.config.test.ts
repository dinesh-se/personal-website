import config from './tailwind.config';

describe('tailwind.config', () => {
	it('uses class strategy for darkMode', () => {
		expect(config.darkMode).toBe('class');
	});
});
