import { GraphQLClient, gql } from 'graphql-request';

import { Author } from '@types';

const client = new GraphQLClient(
	`https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/${process.env.HYGRAPH_ADMIN_ID}/master`,
	{
		headers: {
			authorization: `Bearer ${process.env.HYGRAPH_AUTH_TOKEN}`,
		},
	}
);

const hygraphUser = {
	id: process.env.HYGRAPH_USER_ID,
};

const GET_USER = gql`
	query UserData($id: ID!) {
		profile: profile(where: { id: $id }, stage: PUBLISHED, locales: en) {
			summary
			contactDetail {
				email
				mobileNumber
				socialMedia {
					linkedin
					github
				}
			}
			experience {
				organizations {
					orgName
					title
					from
					to
					orgLogo {
						url
					}
				}
			}
			githubRecentProjects {
				repositories(
					first: 3
					orderBy: { field: UPDATED_AT, direction: DESC }
				) {
					nodes {
						id
						name
						description
						url
					}
				}
			}
		}
	}
`;

const GET_MORE_DETAILS = gql`
	query ProfileUsers($id: ID!) {
		profile(where: { id: $id }, stage: PUBLISHED, locales: en) {
			displayPicture {
				url
			}
			moreDetails {
				raw
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

const GET_REPOS = gql`
	query content_profile_githubRecentProjects($id: ID!) {
		profile(where: { id: $id }, stage: PUBLISHED) {
			contactDetail {
				email
			}
			githubRecentProjects {
				repositories(
					orderBy: { field: UPDATED_AT, direction: DESC }
					first: 10
				) {
					nodes {
						description
						name
						id
						url
						primaryLanguage {
							color
							name
						}
					}
				}
			}
		}
	}
`;

const GET_USES = gql`
	query ProfileUsers($id: ID!) {
		profile(where: { id: $id }, stage: PUBLISHED, locales: en) {
			uses {
				id
				title
				list {
					id
					name
					description
				}
			}
		}
	}
`;

export const getUser = async () => {
	const user = await client.request<Author>(GET_USER, hygraphUser);

	return user;
};

export const getMoreDetails = async () => {
	const moreDetails = await client.request<Author>(
		GET_MORE_DETAILS,
		hygraphUser
	);

	return moreDetails;
};

export const getRepos = async () => {
	const data = await client.request<Author>(GET_REPOS, hygraphUser);

	return data;
};

export const getUses = async () => {
	const {
		profile: { uses },
	} = await client.request<Author>(GET_USES, hygraphUser);

	return uses;
};
