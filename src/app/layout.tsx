import type { Metadata } from 'next';

import { Footer } from '@components/Footer';
import { Header } from '@components/Header';

import '@styles/globals.css';

export const metadata: Metadata = {
	title: 'Dinesh Haribabu',
	description:
		'A front-end web developer focused on crafting clean and intuitive interfaces providing better UX.',
	authors: {
		name: 'Dinesh Haribabu',
		url: 'https://dineshharibabu.in/',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Header></Header>
				<main className="dark:text-slate-20 m-auto min-h-full max-w-7xl p-8 pb-16 pt-12">
					{children}
				</main>
				<Footer></Footer>
			</body>
		</html>
	);
}
