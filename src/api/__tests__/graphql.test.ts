import { classifyHygraphError, createGraphQLClient } from '../graphql';

// Minimal mock Response satisfying graphql-request's expectations in a jsdom
// environment (where the Node `Response` global is unavailable).
function mockOkResponse(body: unknown) {
	const text = JSON.stringify(body);
	return {
		ok: true,
		status: 200,
		statusText: 'OK',
		headers: { get: () => 'application/json' },
		text: () => Promise.resolve(text),
		json: () => Promise.resolve(body),
	};
}

describe('createGraphQLClient', () => {
	it('sets the authorization header with exactly one "Bearer " prefix', async () => {
		const seenHeaders: Record<string, string> = {};
		const fetchImpl = jest.fn(
			async (_input: RequestInfo | URL, init?: RequestInit) => {
				const headers = init?.headers as Record<string, string> | Headers;
				if (typeof (headers as Headers)?.forEach === 'function') {
					(headers as Headers).forEach((value, key) => {
						seenHeaders[key] = value;
					});
				} else {
					Object.assign(seenHeaders, headers);
				}
				return mockOkResponse({ data: { profile: null } });
			}
		) as unknown as typeof fetch;

		const client = createGraphQLClient(fetchImpl);
		await client.request('query { __typename }');

		const auth = seenHeaders.authorization;
		expect(auth).toBeDefined();
		// Exactly one "Bearer " prefix — never "Bearer Bearer ...".
		expect(auth?.match(/Bearer /g)).toHaveLength(1);
	});

	it('passes an AbortSignal timeout to the underlying fetch', async () => {
		let receivedSignal: AbortSignal | null | undefined;
		const fetchImpl = jest.fn(
			async (_input: RequestInfo | URL, init?: RequestInit) => {
				receivedSignal = init?.signal ?? null;
				return mockOkResponse({ data: { profile: null } });
			}
		) as unknown as typeof fetch;

		const client = createGraphQLClient(fetchImpl);
		await client.request('query { __typename }');

		expect(receivedSignal).toBeDefined();
		// AbortSignal.timeout returns an AbortSignal (its `aborted`/`reason`
		// fields are present before the timeout fires).
		expect(receivedSignal instanceof AbortSignal).toBe(true);
	});
});

describe('classifyHygraphError', () => {
	it('classifies a timeout as network', () => {
		const timeout = new DOMException(
			'The operation timed out.',
			'TimeoutError'
		);
		expect(classifyHygraphError(timeout)).toBe('network');
	});

	it('classifies 401 as auth', () => {
		const err = Object.assign(new Error('unauthorized'), { status: 401 });
		expect(classifyHygraphError(err)).toBe('auth');
	});

	it('classifies 403 as auth', () => {
		const err = Object.assign(new Error('forbidden'), { status: 403 });
		expect(classifyHygraphError(err)).toBe('auth');
	});

	it('classifies 429 as rate_limit', () => {
		const err = Object.assign(new Error('too many'), { status: 429 });
		expect(classifyHygraphError(err)).toBe('rate_limit');
	});

	it('classifies 5xx as server', () => {
		const err = Object.assign(new Error('boom'), { status: 503 });
		expect(classifyHygraphError(err)).toBe('server');
	});

	it('classifies a status-less Error as network', () => {
		expect(classifyHygraphError(new Error('ECONNREFUSED'))).toBe('network');
	});

	it('classifies unknown values as unknown', () => {
		expect(classifyHygraphError('garbage')).toBe('unknown');
	});
});
