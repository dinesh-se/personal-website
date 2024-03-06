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
				eMail
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
  query ProfileUsers {
    profile(where: {id: "${process.env.HYGRAPH_USER_ID}"}, stage: PUBLISHED, locales: en) {
      displayPicture {
        url
      }
      moreDetails {
        raw
      }
      contactDetail {
        eMail
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

export const getUser = async () => {
	const user = await client.request<Author>(GET_USER, hygraphUser);

	return user;
};

export const getMoreDetails = async () => {
	const moreDetails = await client.request<Author>(GET_MORE_DETAILS);

	return moreDetails;
};

export const getRepos = async () => {
	const data = await client.request<Author>(GET_REPOS, hygraphUser);

	return data;
};
