import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

import { Footer } from '@components/Footer';
import { Header } from '@components/Header';

import '@styles/globals.css';

import DarkModeProvider from './DarkModeProvider';

export function generateMetadata(): Metadata {
	return {
		title: 'Dinesh Haribabu',
		description:
			'A front-end web developer focused on crafting clean and intuitive interfaces providing better UX.',
		authors: {
			name: 'Dinesh Haribabu',
			url: 'https://dineshharibabu.in/',
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`,
					}}
				/>
			</head>
			<body className="antialiased">
				<DarkModeProvider>
					<a href="#main-content" className="skip-nav">
						Skip to main content
					</a>
					<Header />
					<main
						id="main-content"
						className="dark:text-slate-20 m-auto min-h-full max-w-7xl p-8 pb-16 pt-12"
					>
						{children}
					</main>
					<Footer />
					<Analytics />
				</DarkModeProvider>
			</body>
		</html>
	);
}
