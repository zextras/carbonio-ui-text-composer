/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { describe, expect, it } from 'vitest';

import { calculateTinyMCELanguage } from '../locale-utils';

describe('calculateTinyMCELanguage', () => {
	describe('when userLocale is undefined', () => {
		it('should return "en" as default locale', () => {
			const result = calculateTinyMCELanguage(undefined);
			expect(result).toBe('en');
		});
	});

	describe('when userLocale is valid and has tinymceLocale', () => {
		it('should return the tinymceLocale for Dutch', () => {
			const result = calculateTinyMCELanguage('nl');
			expect(result).toBe('nl');
		});

		it('should return the tinymceLocale for English', () => {
			const result = calculateTinyMCELanguage('en');
			expect(result).toBe('en');
		});

		it('should return the tinymceLocale for German', () => {
			const result = calculateTinyMCELanguage('de');
			expect(result).toBe('de');
		});

		it('should return the tinymceLocale for Hungarian', () => {
			const result = calculateTinyMCELanguage('hu');
			expect(result).toBe('hu_HU');
		});

		it('should return the tinymceLocale for Indonesian', () => {
			const result = calculateTinyMCELanguage('id');
			expect(result).toBe('id');
		});

		it('should return the tinymceLocale for Italian', () => {
			const result = calculateTinyMCELanguage('it');
			expect(result).toBe('it');
		});

		it('should return the tinymceLocale for Portuguese (pt_BR differs from value)', () => {
			const result = calculateTinyMCELanguage('pt');
			expect(result).toBe('pt_BR');
		});

		it('should return the tinymceLocale for French (fr_FR differs from value)', () => {
			const result = calculateTinyMCELanguage('fr');
			expect(result).toBe('fr_FR');
		});

		it('should return the tinymceLocale for Thai (th_TH differs from value)', () => {
			const result = calculateTinyMCELanguage('th');
			expect(result).toBe('th_TH');
		});

		it('should return the tinymceLocale for Slovenian (sl_SI differs from value)', () => {
			const result = calculateTinyMCELanguage('sl');
			expect(result).toBe('sl_SI');
		});
	});

	describe('when userLocale is not in STATIC_LOCALES', () => {
		it('should return the original locale for unknown locale', () => {
			const result = calculateTinyMCELanguage('unknown_locale');
			expect(result).toBe('unknown_locale');
		});

		it('should return the original locale for empty string', () => {
			const result = calculateTinyMCELanguage('');
			expect(result).toBe('');
		});

		it('should return the original locale for random string', () => {
			const result = calculateTinyMCELanguage('xyz123');
			expect(result).toBe('xyz123');
		});
	});

	describe('edge cases', () => {
		it('should handle null as undefined', () => {
			const result = calculateTinyMCELanguage(null as unknown as string);
			expect(result).toBe('en');
		});

		it('should handle locale with special characters', () => {
			const result = calculateTinyMCELanguage('en-US@variant');
			expect(result).toBe('en-US@variant');
		});

		it('should handle numeric locale strings', () => {
			const result = calculateTinyMCELanguage('123');
			expect(result).toBe('123');
		});
	});

	describe('locale precedence', () => {
		it('should prefer tinymceLocale over value when both exist', () => {
			const result = calculateTinyMCELanguage('hu');
			expect(result).toBe('hu_HU'); // tinymceLocale
			expect(result).not.toBe('hu'); // value
		});

		it('should return the original locale when not in STATIC_LOCALES', () => {
			const result = calculateTinyMCELanguage('unknown_locale');
			expect(result).toBe('unknown_locale');
		});
	});
});
