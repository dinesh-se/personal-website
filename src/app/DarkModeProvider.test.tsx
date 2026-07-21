import { jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';

import DarkModeProvider from './DarkModeProvider';
import { useTheme } from './ThemeContext';

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: jest.fn((key: string) => store[key] ?? null),
		setItem: jest.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: jest.fn((key: string) => {
			delete store[key];
		}),
		clear: jest.fn(() => {
			store = {};
		}),
		get length() {
			return Object.keys(store).length;
		},
	};
})();

beforeEach(() => {
	localStorageMock.clear();
	localStorageMock.getItem.mockClear();
	localStorageMock.setItem.mockClear();
	document.documentElement.classList.remove('dark');
	// Default matchMedia to light
	(window.matchMedia as any).mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	}));
});

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
	writable: true,
});

function ThemeToggle() {
	const { toggleDark, dark } = useTheme();
	return (
		<div>
			<span data-testid="theme-state">{dark ? 'dark' : 'light'}</span>
			<button data-testid="theme-toggle" onClick={toggleDark}>
				Toggle
			</button>
		</div>
	);
}

describe('DarkModeProvider', () => {
	it('initializes dark state from localStorage and applies class to html', async () => {
		localStorageMock.setItem('theme', 'dark');

		render(
			<DarkModeProvider>
				<ThemeToggle />
			</DarkModeProvider>
		);

		// State is initialized synchronously via lazy useState initializer
		expect(screen.getByTestId('theme-state').textContent).toBe('dark');

		// Wait for useEffect to apply class and persist
		await act(async () => {});

		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
	});

	it('initializes light state when no localStorage value and system is light', async () => {
		(window.matchMedia as any).mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		}));

		render(
			<DarkModeProvider>
				<ThemeToggle />
			</DarkModeProvider>
		);

		// State is initialized synchronously
		expect(screen.getByTestId('theme-state').textContent).toBe('light');

		await act(async () => {});

		expect(document.documentElement.classList.contains('dark')).toBe(false);
		expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
	});

	it('defaults to system preference when no localStorage value and system is dark', async () => {
		// System is dark
		(window.matchMedia as any).mockImplementation((query: string) => ({
			matches: true,
			media: query,
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		}));

		render(
			<DarkModeProvider>
				<ThemeToggle />
			</DarkModeProvider>
		);

		// State is initialized synchronously
		expect(screen.getByTestId('theme-state').textContent).toBe('dark');

		await act(async () => {});

		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
	});

	it('toggles dark class and writes to localStorage on toggle', async () => {
		// No localStorage value, system is light
		(window.matchMedia as any).mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		}));

		render(
			<DarkModeProvider>
				<ThemeToggle />
			</DarkModeProvider>
		);

		await act(async () => {});

		expect(screen.getByTestId('theme-state').textContent).toBe('light');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
		expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');

		// Toggle to dark
		await act(async () => {
			fireEvent.click(screen.getByTestId('theme-toggle'));
		});

		expect(screen.getByTestId('theme-state').textContent).toBe('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(localStorageMock.setItem).toHaveBeenLastCalledWith('theme', 'dark');

		// Toggle back to light
		await act(async () => {
			fireEvent.click(screen.getByTestId('theme-toggle'));
		});

		expect(screen.getByTestId('theme-state').textContent).toBe('light');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
		expect(localStorageMock.setItem).toHaveBeenLastCalledWith('theme', 'light');
	});
});
