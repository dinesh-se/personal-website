import { RichTextContent } from '@graphcms/rich-text-types';

import { Uses } from './uses';

export interface Author {
	profile: Profile;
}

interface Profile {
	fullName: string;
	summary: string;
	contactDetail: ContactDetail;
	experience: Experience;
	displayPicture: DisplayPicture;
	moreDetails: MoreDetails;
	githubRecentProjects: GithubRecentProjects;
	uses: Uses[];
}

interface ContactDetail {
	eMail: string;
	mobileNumber: string[];
	socialMedia: SocialMedia;
}

interface SocialMedia {
	linkedin: string;
	github: string;
}

export interface Contact extends SocialMedia, Pick<ContactDetail, 'eMail'> {}

export interface Experience {
	organizations: Organization[];
}

interface Organization {
	orgName: string;
	title: string;
	from: string;
	to: string;
	orgLogo: OrgLogo;
}

interface OrgLogo {
	url: string;
}

interface DisplayPicture {
	url: string;
}

interface MoreDetails {
	raw: RichTextContent;
}

interface Repo {
	id: string;
	name: string;
	description: string;
	url: string;
	primaryLanguage: PrimaryLanguage;
}

interface PrimaryLanguage {
	name: string;
	color: string;
}

export interface RepoUI extends Omit<Repo, 'id' | 'url'> {
	href: Repo['url'];
}

export interface Projects {
	projects: Repo[];
}

type GithubRecentProjects = {
	repositories: {
		nodes: Repo[];
	};
};
