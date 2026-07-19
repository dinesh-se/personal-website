'use cache';
// cacheLife: medium
import { getUser } from '@api/graphql';

export async function getProfile() {
	const { profile } = await getUser();
	return profile;
}
