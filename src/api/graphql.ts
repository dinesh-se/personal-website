import { GraphQLClient, gql } from 'graphql-request';

import { Author } from '../types/author';

const client = new GraphQLClient(
	`https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/${process.env.HYGRAPH_ADMIN_ID}/master`,
	{
		headers: {
			authorization: `Bearer ${process.env.HYGRAPH_AUTH_TOKEN}`,
		},
	}
);

const GET_USER = gql`
  query ProfileUsers {
    profile(where: {id: "${process.env.HYGRAPH_USER_ID}"}, stage: PUBLISHED, locales: en) {
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

export const getUser = async () => {
	const user = await client.request<Author>(GET_USER);

	return user;
};

export const getMoreDetails = async () => {
	const moreDetails = await client.request<Author>(GET_MORE_DETAILS);

	return moreDetails;
};
