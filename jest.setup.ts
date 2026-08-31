import '@testing-library/jest-dom';

// Mock `next/cache` for unit tests. Pages import `cacheLife` (via the
// `use cache` directive) which pulls Next server internals (`next/server`,
// `Request`, `Response`, `fetch`) that are unavailable in the jsdom test
// environment. Stubbing the module avoids loading that chain entirely; the
// real caching behaviour is exercised by `npm run build` and the e2e specs.
jest.mock('next/cache', () => ({
	cacheLife: jest.fn(),
	cacheTag: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});
