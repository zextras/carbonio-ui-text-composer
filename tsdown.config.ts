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
	dts: true,
	external: [
		'react',
		'react-dom',
		'@zextras/carbonio-design-system',
		'@zextras/carbonio-ui-soap-lib',
		'react-i18next',
		'@emotion/styled'
	],
	noExternal: ['tinymce', '@tinymce/tinymce-react'],
	splitting: false,
	treeshake: true,
	minify: false,
	outDir: 'dist',
	outExtension({ format }) {
		return {
			js: format === 'cjs' ? '.cjs' : '.mjs'
		};
	},
	async onSuccess() {
		// Copy TinyMCE assets to dist folder
		const assetsSource = path.join(process.cwd(), 'src/assets');
		const assetsTarget = path.join(process.cwd(), 'dist/assets');

		if (fs.existsSync(assetsSource)) {
			console.log('📦 Copying TinyMCE assets to dist/assets...');
			await fs.promises.cp(assetsSource, assetsTarget, { recursive: true });
			console.log('✅ Assets copied successfully');
		}
	}
});
