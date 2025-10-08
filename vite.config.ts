/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/tests/**/*']
		}),
		{
			name: 'copy-tinymce-assets',
			closeBundle: async () => {
				// Copy TinyMCE assets to dist folder
				const assetsSource = path.join(process.cwd(), 'src/assets');
				const assetsTarget = path.join(process.cwd(), 'dist/assets');

				// Copy node_modules/tinymce/plugins/ to dist/assets/plugins
				const tinymcePluginsSource = path.join(process.cwd(), 'node_modules', 'tinymce', 'plugins');
				const tinymcePluginsTarget = path.join(assetsTarget, 'plugins');
				if (fs.existsSync(tinymcePluginsSource)) {
					console.log('📦 Copying TinyMCE plugins to dist/assets/plugins...');
					await fs.promises.cp(tinymcePluginsSource, tinymcePluginsTarget, { recursive: true });
					console.log('✅ Plugins copied successfully');
				}

				if (fs.existsSync(assetsSource)) {
					console.log('📦 Copying TinyMCE assets to dist/assets...');
					await fs.promises.cp(assetsSource, assetsTarget, { recursive: true });
					console.log('✅ Assets copied successfully');
				}
			}
		}
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'CarbonioUITextComposer',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
		},
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'react/jsx-runtime',
				'@zextras/carbonio-design-system',
				'react-i18next',
				'@emotion/styled',
				'@emotion/react',
				'i18next'
			],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react/jsx-runtime': 'jsxRuntime',
					'@emotion/styled': 'styled',
					'@emotion/react': 'emotionReact'
				},
				// Preserve modules to avoid issues with external dependencies
				preserveModules: false,
				// Ensure proper interop for default exports
				interop: 'auto'
			}
		},
		sourcemap: true,
		minify: false,
		target: 'es2020',
		cssCodeSplit: false
	}
});
