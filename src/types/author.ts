export interface Author {
  profile: Profile;
}

interface Profile {
  fullName: string;
  interests: string[];
  summary: string;
  contactDetail: ContactDetail;
  experience: Experience;
  testWyswyg: object;
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
