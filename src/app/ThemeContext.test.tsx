import { jest } from '@jest/globals';
import { act, render, renderHook, screen } from '@testing-library/react';

import { ThemeProvider, useTheme } from './ThemeContext';

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

describe('ThemeProvider', () => {
	it('initializes dark as false when no localStorage value and system is light', () => {
		// matchMedia returns false for dark query (light mode system)
		(window.matchMedia as any).mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		}));

		const { result } = renderHook(() => useTheme(), {
			wrapper: ThemeProvider,
		});

		// State is initialized synchronously via lazy useState initializer
		expect(result.current.dark).toBe(false);
	});

	it('initializes dark as true when no localStorage value and system is dark', () => {
		// Simulates prefers-color-scheme: dark
		(window.matchMedia as any).mockImplementation((query: string) => ({
			matches: true,
			media: query,
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		}));

		const { result } = renderHook(() => useTheme(), {
			wrapper: ThemeProvider,
		});

		expect(result.current.dark).toBe(true);
	});

	it('reads dark preference from localStorage when stored', () => {
		localStorageMock.setItem('theme', 'dark');

		const { result } = renderHook(() => useTheme(), {
			wrapper: ThemeProvider,
		});

		expect(result.current.dark).toBe(true);
	});

	it('reads light preference from localStorage when stored', () => {
		localStorageMock.setItem('theme', 'light');

		const { result } = renderHook(() => useTheme(), {
			wrapper: ThemeProvider,
		});

		expect(result.current.dark).toBe(false);
	});

	it('toggleDark flips the dark state', () => {
		const { result } = renderHook(() => useTheme(), {
			wrapper: ThemeProvider,
		});

		const initialDark = result.current.dark;

		act(() => {
			result.current.toggleDark();
		});

		expect(result.current.dark).toBe(!initialDark);

		act(() => {
			result.current.toggleDark();
		});

		expect(result.current.dark).toBe(initialDark);
	});

	it('throws when useTheme is called outside ThemeProvider', () => {
		expect(() => {
			renderHook(() => useTheme());
		}).toThrow('useTheme must be used within ThemeProvider');
	});
});
