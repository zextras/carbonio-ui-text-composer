/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useMemo, useRef } from 'react';

import type { IAllProps as EditorProps } from '@tinymce/tinymce-react';
import { Editor } from '@tinymce/tinymce-react';
import { Container } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import type { EditorOptions, TinyMCE } from 'tinymce/tinymce';

import 'tinymce/tinymce';

import 'tinymce/models/dom';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';
// importing the plugin js.
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import {
	AccountSettingsPrefs,
	createEditorDefaultStyle,
	generateEditorContentStyle
} from './editor-style-utils';
import { calculateTinyMCELanguage } from './locale-utils';
import { createTinyMCEConfig } from './tinymce-config-utils';
import { createTinyMCESetup } from './tinymce-setup-utils';

declare global {
	// noinspection JSUnusedGlobalSymbols
	interface Window {
		tinymce: TinyMCE;
	}
}

type ComposerProps = Omit<EditorProps, 'onEditorChange'> & {
	/** The callback invoked when an edit is performed into the editor. `([text, html]) => {}` */
	onEditorChange?: (values: [string, string]) => void;
	/** Enable the distraction-free mode */
	inline?: boolean;
	/** The initial content of the editor */
	initialValue?: EditorProps['initialValue'];
	/** The content of the editor (controlled mode) */
	value?: EditorProps['value'];
	/**
	 * Callback called when user choose some file from the os.
	 * If defined, a menu item to add inline images is added to the composer.
	 */
	onFileSelect?: (arg: { editor: TinyMCE; files: HTMLInputElement['files'] | undefined }) => void;
	customInitOptions?: Partial<Omit<EditorOptions, 'selector' | 'target'>>;
	/** Whether the editor should be disabled */
	disabled?: boolean;
	/** UserPreferences */
	accountSettingsPrefs?: AccountSettingsPrefs;
};

export const Composer = ({
	onEditorChange,
	onFileSelect,
	inline = false,
	value,
	initialValue,
	customInitOptions,
	disabled,
	accountSettingsPrefs = {
		zimbraPrefLocale: 'en',
		zimbraPrefHtmlEditorDefaultFontFamily: 'Arial',
		zimbraPrefHtmlEditorDefaultFontSize: '12pt',
		zimbraPrefHtmlEditorDefaultFontColor: '#000000'
	},
	...rest
}: ComposerProps): React.JSX.Element => {
	const isControlledMode = useMemo(() => !!onEditorChange, [onEditorChange]);

	const _onEditorChange = useCallback<NonNullable<EditorProps['onEditorChange']>>(
		(_newContent, editor) => {
			onEditorChange?.([
				editor.getContent({ format: 'text' }),
				editor.getContent({ format: 'html' })
			]);
		},
		[onEditorChange]
	);

	const inputRef = useRef<HTMLInputElement>(null);
	const editorRef = useRef<TinyMCE | null>(null);
	const onFileClick = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.value = '';
			inputRef.current.click();
		}
	}, []);
	const [t] = useTranslation();

	const language = useMemo(
		() => calculateTinyMCELanguage(accountSettingsPrefs.zimbraPrefLocale),
		[accountSettingsPrefs.zimbraPrefLocale]
	);

	const inlineLabel = useMemo(() => t('label.add_inline_image', 'Add inline image'), [t]);
	const selectImageTooltip = useMemo(() => t('label.select_image', 'Select image'), [t]);

	const setupCallback = useMemo(
		() =>
			createTinyMCESetup({
				onFileSelect,
				onFileClick,
				inlineLabel,
				selectImageTooltip
			}),
		[inlineLabel, onFileClick, onFileSelect, selectImageTooltip]
	);

	const contentStyle = useMemo(() => {
		const defaultStyle = createEditorDefaultStyle(accountSettingsPrefs);
		return generateEditorContentStyle(defaultStyle);
	}, [accountSettingsPrefs]);

	const editorInitConfig = useMemo(
		() =>
			createTinyMCEConfig({
				language,
				inline,
				contentStyle,
				setup: setupCallback,
				customOptions: customInitOptions
			}),
		[contentStyle, customInitOptions, inline, language, setupCallback]
	);

	const fileInputOnChange = useCallback(() => {
		if (onFileSelect && inputRef.current && editorRef.current) {
			onFileSelect({ editor: editorRef.current, files: inputRef.current.files });
		}
	}, [onFileSelect]);

	const onInit = useCallback<NonNullable<EditorProps['onInit']>>(
		(_evt, editor) => {
			editorRef.current = window.tinymce;
			rest.onInit?.(_evt, editor);
		},
		[rest]
	);

	return (
		<Container
			height="100%"
			crossAlignment="baseline"
			mainAlignment="flex-start"
			style={{ overflowY: 'hidden' }}
		>
			<input
				data-testid="file-input"
				type="file"
				ref={inputRef}
				accept="image/*"
				onChange={fileInputOnChange}
				multiple
				style={{ display: 'none' }}
			/>

			<Editor
				initialValue={initialValue}
				value={value}
				init={editorInitConfig}
				onEditorChange={isControlledMode ? _onEditorChange : undefined}
				onInit={onInit}
				disabled={disabled}
				{...rest}
			/>
			<style>{`
				.tox.tox-tinymce {
					width: 100%;
				}
			`}</style>
		</Container>
	);
};
