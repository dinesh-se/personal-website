'use client';

import { useEffect } from 'react';

import { ThemeProvider, useTheme } from './ThemeContext';

function DarkModeEffects() {
	const { dark } = useTheme();

	useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}, [dark]);

	return null;
}

function HtmlWrapper({ children }: { children: React.ReactNode }) {
	const { dark } = useTheme();
	return (
		<html lang="en" className={dark ? 'dark' : ''}>
			<body className="antialiased">{children}</body>
		</html>
	);
}

export default function DarkModeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider>
			<DarkModeEffects />
			<HtmlWrapper>{children}</HtmlWrapper>
		</ThemeProvider>
	);
}
