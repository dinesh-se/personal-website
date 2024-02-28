import Image from "next/image";
import { RichText } from "@graphcms/rich-text-react-renderer";
import { RichTextContent } from "@graphcms/rich-text-types";

import LogoReact from '@root/public/assets/tech/react.svg';
import LogoAngular from '@root/public/assets/tech/angular.svg';
import LogoRxJS from '@root/public/assets/tech/rxjs.svg';
import LogoTS from '@root/public/assets/tech/typescript.svg';
import LogoTailwindCSS from '@root/public/assets/tech/tailwindcss.svg';
import LogoNext from '@root/public/assets/tech/nextjs.svg';
import LogoHygraph from '@root/public/assets/tech/hygraph.svg';
import LogoStorybook from '@root/public/assets/tech/storybook.svg';
import LogoCypress from '@root/public/assets/tech/cypress.svg';
import { getMoreDetails } from "@api/graphql";
import Contact from "@components/Contact";

export default async function About() {
  const {
    profile: {
      displayPicture: {
        url
      },
      moreDetails: {
        raw
      },
      contactDetail: {
        eMail,
        socialMedia: {
          linkedin,
          github,
        },
      }
    }
  }: any = await getMoreDetails();

  return (
    <>
      <h1 className="text-3xl">A little more about me!</h1>
      <section className="md:flex pt-4 pb-6">
        <section className="space-y-4 md:w-3/5 pr-8 leading-relaxed tracking-wide">
          <RichText
            content={raw}
            renderers={{
              p: ({ children }) => (
                <p className=''>
                  {children}
                </p>
              ),
              code: ({ children }) => (
                <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
                  {children}
                </span>
              )
            }}
          />
        </section>
        <section className="flex flex-col md:flex-1 justify-center align-center">
          <Image src={url} width="360" height="480" alt="Dinesh Haribabu" />
          <Contact linkedin={linkedin} github={github} eMail={eMail} />
        </section>
      </section>
      <section className="bg-neutral-200 dark:bg-gray-950 -mx-8 px-4 py-8">
        <h2 className="headline mt-10 text-center text-xl md:text-2xl lg:text-3xl">Some of my favorite&nbsp;
          <span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">technologies</span>
          &nbsp;to work with
        </h2>
        <div className="mx-auto mt-14 mb-16 flex max-w-4xl flex-wrap items-center justify-center gap-x-16 gap-y-8">
            <LogoReact className="w-12 sm:w-16" aria-label="React.js" title="React" />
            <LogoAngular className="w-16 sm:w-20" aria-label="Angular" />
            <LogoTS className="w-10 sm:w-14" aria-label="TypeScript" />
            <LogoRxJS className="w-12 sm:w-16" aria-label="RxJS" />
						<LogoNext className="w-28 sm:w-36" aria-label="Next.js" />
            <LogoTailwindCSS className="w-12 sm:w-16" aria-label="Tailwind CSS" />
						<LogoHygraph className="w-28 md:w-36" aria-label="Hygraph" />
						<LogoStorybook className="w-32 md:w-40" aria-label="Storybook" />
						<LogoCypress className="w-28 sm:w-36" aria-label="Cypress" />
					</div>
      </section>
    </>
  );
}
