import { GraphQLClient, gql } from 'graphql-request';

import { Author } from '@types';

/**
 * Mirrors the error taxonomy used in src/api/rest.ts so every fetch layer
 * classifies failures consistently.
 */
export type HygraphErrorType =
	'network' | 'rate_limit' | 'auth' | 'server' | 'malformed' | 'unknown';

export type HygraphFetchResult<T> =
	{ success: true; data: T } | { success: false; errorType: HygraphErrorType };

const DEFAULT_TIMEOUT_MS = 10_000;

const HYGRAPH_ENDPOINT = `https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/${process.env.HYGRAPH_ADMIN_ID}/master`;

const hygraphUser = {
	id: process.env.HYGRAPH_USER_ID,
};

/**
 * Builds a GraphQLClient with an injectable fetch (so tests can mock
 * responses) and a per-request timeout. The authorization header must use
 * the `Bearer ` scheme — verified live (Bearer → 200).
 */
export function createGraphQLClient(
	fetchImpl: typeof globalThis.fetch | undefined = undefined,
	timeoutMs = DEFAULT_TIMEOUT_MS
): GraphQLClient {
	// Resolve the fetch implementation lazily at request time so the module can
	// be imported in environments (e.g. jsdom tests) where `globalThis.fetch`
	// may not exist until a request is actually made.
	const fetchWithTimeout = (input: RequestInfo | URL, init?: RequestInit) => {
		const impl = fetchImpl ?? globalThis.fetch;
		const signal = init?.signal ?? AbortSignal.timeout(timeoutMs);
		return impl(input, { ...init, signal });
	};

	return new GraphQLClient(HYGRAPH_ENDPOINT, {
		headers: {
			authorization: `Bearer ${process.env.HYGRAPH_AUTH_TOKEN}`,
		},
		fetch: fetchWithTimeout,
	});
}

const client = createGraphQLClient();

/**
 * Classifies a thrown GraphQL error into a stable error type.
 */
export function classifyHygraphError(error: unknown): HygraphErrorType {
	if (error instanceof DOMException && error.name === 'TimeoutError') {
		return 'network';
	}

	const status = (error as { status?: number })?.status;

	if (status === 401 || status === 403) {
		return 'auth';
	}
	if (status === 429) {
		return 'rate_limit';
	}
	if (status !== undefined && status >= 500) {
		return 'server';
	}
	if (status === undefined && error instanceof Error) {
		// A fetch-level network failure (ECONNREFUSED, aborted, DNS) has no status.
		return 'network';
	}

	return 'unknown';
}

const GET_PROFILE = gql`
	query ProfileData($id: ID!) {
		profile: profile(where: { id: $id }, stage: PUBLISHED, locales: en) {
			fullName
			summary
			interests
			moreDetails {
				raw
			}
			displayPicture {
				url
			}
			contactDetail {
				email
				mobileNumber
				socialMedia {
					linkedin
					github
				}
			}
		}
	}
`;

export const getProfile = async (): Promise<HygraphFetchResult<Author>> => {
	try {
		const data = await client.request<Author>(GET_PROFILE, hygraphUser);
		return { success: true, data };
	} catch (error) {
		return { success: false, errorType: classifyHygraphError(error) };
	}
};
