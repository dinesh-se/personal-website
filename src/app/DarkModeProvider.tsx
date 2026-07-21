'use client';

import { ThemeProvider } from './ThemeContext';

export default function DarkModeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ThemeProvider>{children}</ThemeProvider>;
}
