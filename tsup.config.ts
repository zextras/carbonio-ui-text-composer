/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	sourcemap: true,
	clean: true,
	dts: true,
	external: ['react', 'react-dom'],
	noExternal: ['tinymce']
});
