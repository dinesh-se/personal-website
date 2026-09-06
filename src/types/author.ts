import { RichTextContent } from '@graphcms/rich-text-types';

export interface Author {
	profile: Profile;
}

interface Profile {
	fullName: string;
	summary: string;
	interests: string[];
	contactDetail: ContactDetail;
	displayPicture: DisplayPicture;
	moreDetails: MoreDetails;
}

interface ContactDetail {
	email: string;
	mobileNumber: string[];
	socialMedia: SocialMedia;
}

interface SocialMedia {
	linkedin: string;
	github: string;
}

export interface Contact extends SocialMedia, Pick<ContactDetail, 'email'> {}

interface DisplayPicture {
	url: string;
}

interface MoreDetails {
	raw: RichTextContent;
}
