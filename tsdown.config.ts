/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import * as fs from 'fs';
import * as path from 'path';
import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	sourcemap: true,
	clean: true,
	external: [
		'react',
		'react-dom',
		'react/jsx-runtime',
		'@zextras/carbonio-design-system',
		'@zextras/carbonio-ui-soap-lib',
		'react-i18next',
		'@emotion/styled',
		'@emotion/react',
		'i18next'
	],
	noExternal: ['tinymce', '@tinymce/tinymce-react', 'date-fns'],
	treeshake: false,
	minify: false,
	outDir: 'dist',
	platform: 'browser',
	target: 'es2020',
	onSuccess: async (): Promise<void> => {
		// Copy TinyMCE assets to dist folder
		const assetsSource = path.join(process.cwd(), 'src/assets');
		const assetsTarget = path.join(process.cwd(), 'dist/assets');

		if (fs.existsSync(assetsSource)) {
			// eslint-disable-next-line no-console
			console.log('📦 Copying TinyMCE assets to dist/assets...');
			await fs.promises.cp(assetsSource, assetsTarget, { recursive: true });
			// eslint-disable-next-line no-console
			console.log('✅ Assets copied successfully');
		}
	}
});
