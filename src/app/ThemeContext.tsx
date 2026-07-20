'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';

interface ThemeContextValue {
	dark: boolean;
	toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark') {
			setDark(true);
		} else if (stored === 'light') {
			setDark(false);
		} else {
			setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
		}
	}, []);

	const toggleDark = useCallback(() => setDark((d) => !d), []);

	return (
		<ThemeContext.Provider value={{ dark, toggleDark }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}
