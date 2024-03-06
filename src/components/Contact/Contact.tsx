import { SocialIcon } from 'react-social-icons';

import { Contact as ContactType } from '@types';

const Contact = ({ linkedin, github, eMail }: ContactType) => {
	return (
		<section>
			<SocialIcon
				url={linkedin}
				className="social mx-1"
				fgColor="currentColor"
				bgColor="transparent"
			/>
			<SocialIcon
				url={github}
				className="social mx-1"
				fgColor="currentColor"
				bgColor="transparent"
			/>
			<SocialIcon
				url={`mailto:${eMail}`}
				network="email"
				className="social mx-1"
				fgColor="currentColor"
				bgColor="transparent"
			/>
		</section>
	);
};

export default Contact;
