/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// Utility for safe copy
async function safeCopy(src: string, dest: string): Promise<void> {
	if (!fs.existsSync(src)) return;
	await fs.promises.mkdir(path.dirname(dest), { recursive: true });
	await fs.promises.cp(src, dest, { recursive: true, force: true });
}

export default defineConfig({
	plugins: [
		react({
			jsxRuntime: 'automatic',
			babel: {
				plugins: [
					// Reduce runtime overhead (removes propTypes & debug traces)
					['transform-react-remove-prop-types', { removeImport: true }]
				]
			}
		}),
		dts({
			include: ['src/index.ts', 'src/composer.tsx'],
			exclude: ['src/**/*.test.*', 'src/tests/**/*'],
			copyDtsFiles: false,
			strictOutput: true,
			logLevel: 'error',
			insertTypesEntry: true,
			rollupTypes: false,
			compilerOptions: {
				declarationMap: true
			}
		}),
		{
			name: 'copy-tinymce-assets',
			closeBundle: async (): Promise<void> => {
				const root = process.cwd();
				const srcAssets = path.join(root, 'src/assets');
				const distAssets = path.join(root, 'dist/assets');

				console.log('📦 Copying TinyMCE assets...');
				await safeCopy(srcAssets, distAssets);

				const tinymcePluginsSrc = path.join(root, 'node_modules/tinymce/plugins');
				const tinymcePluginsDest = path.join(distAssets, 'plugins');
				await safeCopy(tinymcePluginsSrc, tinymcePluginsDest);
				const tinymceSkinsSrc = path.join(root, 'node_modules/tinymce/skins');
				const tinymceSkinsDest = path.join(distAssets, 'skins');
				await safeCopy(tinymceSkinsSrc, tinymceSkinsDest);
				console.log('✅ Assets copy completed');
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
				'i18next'
			],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react/jsx-runtime': 'jsxRuntime',
					'@zextras/carbonio-design-system': 'CarbonioDesignSystem',
					'react-i18next': 'reactI18next',
					i18next: 'i18next'
				},
				compact: true, // Minify Rollup output
				preserveModules: false,
				interop: 'auto',
				exports: 'named'
			}
		},
		sourcemap: false, // Disable if not needed for debugging
		minify: 'esbuild', // Use esbuild (faster & smaller)
		target: 'es2020',
		cssCodeSplit: false,
		chunkSizeWarningLimit: 600,
		emptyOutDir: true
	},
	esbuild: {
		drop: ['console', 'debugger'], // Remove console/debugger for smaller builds
		treeShaking: true,
		minifyIdentifiers: true,
		minifyWhitespace: true
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify('production')
	}
});
