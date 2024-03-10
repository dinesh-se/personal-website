import { SocialIcon } from 'react-social-icons';

import { Contact as ContactType } from '@types';

const Contact = ({ linkedin, github, email }: ContactType) => {
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
				url={`mailto:${email}`}
				network="email"
				className="social mx-1"
				fgColor="currentColor"
				bgColor="transparent"
			/>
		</section>
	);
};

export default Contact;
