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

function getInitialTheme(): boolean {
	if (typeof window === 'undefined') {
		return false;
	}
	const stored = localStorage.getItem('theme');
	if (stored === 'dark') {
		return true;
	}
	if (stored === 'light') {
		return false;
	}
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [dark, setDark] = useState(getInitialTheme);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}, [dark]);

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
