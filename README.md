# Carbonio UI Text Composer

A React-based rich text editor component library for Carbonio applications, built on top of TinyMCE.

## Overview

`@zextras/carbonio-ui-text-composer` provides a flexible and feature-rich text composer component designed for use in Carbonio UI applications. It wraps TinyMCE editor with custom configurations, theming, and internationalization support.

## Features

- 🎨 **Rich Text Editing** - Full-featured WYSIWYG editor with extensive formatting options
- 🌍 **Internationalization** - Support for 16 languages (English, German, Spanish, French, Hindi, Hungarian, Italian, Japanese, Dutch, Polish, Portuguese, Romanian, Russian, Thai, Turkish, Vietnamese, Chinese)
- 🎭 **Multiple Themes** - Built-in support for light and dark themes
- 📱 **Inline Mode** - Distraction-free editing experience
- 🖼️ **Image Support** - Inline image insertion with custom file handling
- ♿ **Accessibility** - WCAG compliant editing experience
- 🔧 **Customizable** - Extensive configuration options via TinyMCE
- 📦 **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install @zextras/carbonio-ui-text-composer
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "@zextras/carbonio-design-system": "^11.0.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-i18next": "^12.0.0"
}
```

## Usage

### Basic Example

```tsx
import { Composer } from '@zextras/carbonio-ui-text-composer';

function MyEditor() {
  const handleChange = ([text, html]: [string, string]) => {
    console.log('Text content:', text);
    console.log('HTML content:', html);
  };

  return (
    <Composer
      onEditorChange={handleChange}
      initialValue="<p>Hello, world!</p>"
    />
  );
}
```

### Inline Mode (Distraction-Free)

```tsx
<Composer
  inline={true}
  onEditorChange={handleChange}
  initialValue="<p>Start typing...</p>"
/>
```

### Controlled Mode

```tsx
function ControlledEditor() {
  const [content, setContent] = useState('<p>Initial content</p>');

  const handleChange = ([text, html]: [string, string]) => {
    setContent(html);
  };

  return (
    <Composer
      value={content}
      onEditorChange={handleChange}
    />
  );
}
```

### With Image Upload Support

```tsx
<Composer
  onEditorChange={handleChange}
  onFileSelect={({ editor, files }) => {
    if (files) {
      // Handle file upload logic
      Array.from(files).forEach(file => {
        // Process and insert image
        const reader = new FileReader();
        reader.onload = (e) => {
          editor.insertContent(`<img src="${e.target?.result}" />`);
        };
        reader.readAsDataURL(file);
      });
    }
  }}
/>
```

### Custom Configuration

```tsx
<Composer
  onEditorChange={handleChange}
  customInitOptions={{
    height: 500,
    menubar: true,
    toolbar: 'undo redo | bold italic | alignleft aligncenter',
    // Any TinyMCE init options
  }}
/>
```

### Disabled State

```tsx
<Composer
  disabled={true}
  initialValue="<p>Read-only content</p>"
/>
```

## API Reference

### Composer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onEditorChange` | `(values: [string, string]) => void` | - | Callback invoked when content changes. Receives `[text, html]` array |
| `inline` | `boolean` | `false` | Enable distraction-free inline editing mode |
| `initialValue` | `string` | - | Initial HTML content of the editor (uncontrolled) |
| `value` | `string` | - | HTML content of the editor (controlled mode) |
| `onFileSelect` | `({ editor, files }) => void` | - | Callback for handling file selection. Enables inline image menu item |
| `customInitOptions` | `Partial<EditorOptions>` | - | Custom TinyMCE initialization options |
| `disabled` | `boolean` | `false` | Whether the editor should be disabled |

Additional props from `@tinymce/tinymce-react` Editor component are also supported.

## Built-in Plugins

The composer comes with the following TinyMCE plugins enabled:

- **advlist** - Advanced list formatting
- **anchor** - Anchor/bookmark support
- **autolink** - Automatic link detection
- **autoresize** - Auto-resize editor height
- **charmap** - Special character insertion
- **code** - HTML source code editing
- **directionality** - Text direction (LTR/RTL)
- **fullscreen** - Fullscreen editing mode
- **help** - Help dialog
- **image** - Image insertion and editing
- **insertdatetime** - Insert current date/time
- **link** - Link creation and editing
- **lists** - List formatting
- **media** - Media embedding
- **preview** - Content preview
- **quickbars** - Context toolbars
- **searchreplace** - Find and replace
- **table** - Table support
- **visualblocks** - Visual block boundaries
- **wordcount** - Word and character count

## Supported Languages

The editor automatically detects and uses the appropriate language based on the user's locale:

- English (en)
- German (de)
- Spanish (es)
- French (fr_FR)
- Hindi (hi)
- Hungarian (hu_HU)
- Italian (it)
- Japanese (ja)
- Dutch (nl)
- Polish (pl)
- Portuguese (pt_BR)
- Romanian (ro)
- Russian (ru)
- Thai (th_TH)
- Turkish (tr)
- Vietnamese (vi)
- Chinese Simplified (zh-Hans)

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build

# Run linter
npm run lint

# Format code
npm run prettify
```

### Project Structure

```
src/
├── composer.tsx              # Main Composer component
├── editor-style-utils.ts     # Editor styling utilities
├── locale-utils.ts           # Language detection utilities
├── tinymce-config-utils.ts   # TinyMCE configuration builder
├── tinymce-setup-utils.ts    # TinyMCE setup callbacks
├── assets/                   # TinyMCE skins and language files
└── tests/                    # Unit tests
```

### Testing

The library uses Vitest for testing:

```bash
npm test
```

### Building

The library is built using tsdown and outputs:
- ESM module (`dist/index.mjs`)
- CommonJS module (`dist/index.js`)
- TypeScript definitions (`dist/index.d.ts` and `dist/index.d.mts`)
- Source maps for debugging
- TinyMCE assets copied to `dist/assets/`

```bash
npm run build
```

You can also build JavaScript and types separately:

```bash
# Build only JavaScript (no type definitions)
npm run build:js

# Build only type definitions
npm run build:types
```

## License

This project is licensed under AGPL-3.0-only.

See [LICENSE](./LICENSE) and [COPYING](./COPYING) for more information.

## Third-Party Licenses

This project includes third-party components. See [THIRDPARTIES](./THIRDPARTIES) for details.

## Contributing

Contributions are welcome! Please ensure that:

1. Code follows the project's ESLint and Prettier configurations
2. All tests pass (`npm test`)
3. Type checking passes (`npm run type-check`)
4. Code is properly formatted (`npm run prettify`)

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/zextras/carbonio-ui-text-composer).

## Authors

Zextras Dev Team - [https://www.zextras.com/carbonio/](https://www.zextras.com/carbonio/)

---

**Copyright © 2025 Zextras**
