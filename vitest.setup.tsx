/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import '@testing-library/jest-dom';
import React from 'react';

import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@zextras/carbonio-design-system';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

// Initialize i18next for testing
i18n.use(initReactI18next).init({
	lng: 'en',
	fallbackLng: 'en',
	ns: ['translations'],
	defaultNS: 'translations',
	debug: false,
	interpolation: {
		escapeValue: false
	},
	resources: {
		en: {
			translations: {
				'label.add_inline_image': 'Add inline image',
				'label.select_image': 'Select image'
			}
		}
	}
});

/**
 * Utility function to simplify component testing setup.
 * Returns both userEvent instance and render utilities.
 * Wraps components with ThemeProvider and I18nextProvider for proper testing environment.
 */
export const setupTest = (
	component: React.ReactElement
): RenderResult & { user: ReturnType<typeof userEvent.setup> } => {
	const user = userEvent.setup();
	const renderResult = render(
		<ThemeProvider>
			<I18nextProvider i18n={i18n}>{component}</I18nextProvider>
		</ThemeProvider>
	);
	return {
		user,
		...renderResult
	};
};

// Mock matchMedia
// see: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});
