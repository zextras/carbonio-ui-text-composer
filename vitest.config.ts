/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './vitest.setup.tsx',
		include: ['src/**/*.test.{ts,tsx}'],
		exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
		reporters: process.env.CI ? ['junit', 'default'] : ['default'],
		outputFile: {
			junit: './junit.xml'
		},
		pool: 'forks',
		poolOptions: {
			forks: {
				singleFork: false
			}
		},

		coverage: {
			enabled: true, // should be disabled but the CI expect coverage/lcov.info to be there
			provider: 'v8',
			reportsDirectory: './coverage',
			reporter: ['lcov', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/**/*.test.{ts,tsx}',
				'src/tests/**',
				'vitest.setup.tsx',
				'src/assets/**',
				'src/**/*.d.ts'
			],

			thresholds: {
				lines: 80,
				functions: 80,
				branches: 75,
				statements: 80
			},
			all: true,
			clean: true
		},

		css: false,
		mockReset: true,
		restoreMocks: true,
		clearMocks: true
	}
});
