# Rich Text Editor Widget

A powerful, self-contained rich text editor widget built with React and TipTap. Easy to integrate into any HTML page with zero configuration required.

## ✨ Features

- 🎨 **Rich Text Editing**: Bold, italic, underline, strikethrough, code, and more
- 🎯 **Text Alignment**: Left, center, right, justify
- 📝 **Headings**: H1, H2, H3 support
- 🔗 **Links**: Add and edit hyperlinks
- 📋 **Lists**: Bullet and numbered lists
- 🎨 **Colors**: Text and highlight colors
- 🔤 **Fonts**: Multiple font family options
- 📏 **Customizable**: Min/max height, placeholder, and more
- 🚀 **Self-Contained**: All dependencies bundled (701KB gzipped)
- 💪 **Three Initialization Methods**: Auto-init, programmatic, or class-based

## 🚀 Quick Start

### 1. Include the Files

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="./dist/rich-text-editor-widget.css">
</head>
<body>
    <div id="editor" data-rich-text-editor></div>
    <script src="./dist/rich-text-editor-widget.umd.cjs"></script>
</body>
</html>
```

That's it! The editor will auto-initialize.

## 📚 Usage Methods

### Method 1: Auto-Initialization (Recommended)

Add `data-rich-text-editor` attribute to any element with an ID:

```html
<div id="my-editor" 
     data-rich-text-editor 
     data-placeholder="Start typing..." 
     data-min-height="300px"
     data-on-change="handleChange"></div>

<script>
function handleChange(content) {
    console.log('Content:', content);
}
</script>
```

### Method 2: Programmatic Initialization

Use the `initRichTextEditor()` function:

```html
<div id="my-editor"></div>

<script src="./dist/rich-text-editor-widget.umd.cjs"></script>
<script>
const widget = initRichTextEditor('my-editor', {
    placeholder: 'Type something...',
    minHeight: '300px',
    onChange: (content) => {
        console.log('Content updated:', content);
    }
});
</script>
```

### Method 3: Class-Based Initialization

For full control with lifecycle methods:

```html
<div id="my-editor"></div>

<script src="./dist/rich-text-editor-widget.umd.cjs"></script>
<script>
const widget = new RichTextEditorWidget('my-editor', {
    placeholder: 'Advanced usage...',
    minHeight: '300px',
    onChange: (content) => console.log(content)
});

widget.mount();

// Later, you can:
widget.update({ placeholder: 'New placeholder' });
widget.unmount();
</script>
```

## 🎛️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | string | `'Enter your text'` | Placeholder text |
| `minHeight` | string | `'100px'` | Minimum editor height |
| `maxHeight` | string | `'300px'` | Maximum editor height |
| `value` | string | `''` | Initial content (HTML) |
| `defaultValue` | string | `''` | Default content (HTML) |
| `onChange` | function | `null` | Callback when content changes |
| `className` | string | `''` | Additional CSS classes |
| `showDebugInfo` | boolean | `false` | Show debug information |
| `isModal` | boolean | `false` | Enable modal mode |

## 🏷️ Data Attributes

For auto-initialization, use these data attributes:

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-rich-text-editor` | Enable auto-init (required) | - |
| `data-placeholder` | Placeholder text | `"Type here..."` |
| `data-min-height` | Minimum height | `"250px"` |
| `data-max-height` | Maximum height | `"500px"` |
| `data-on-change` | Global callback function name | `"myCallback"` |

## 🔧 API Reference

### RichTextEditorWidget Class

#### Constructor

```javascript
new RichTextEditorWidget(containerId, options)
```

- **containerId** (string): ID of the container element
- **options** (object): Configuration options

#### Methods

**`mount()`**
```javascript
widget.mount()
```
Mounts the widget to the DOM.

**`unmount()`**
```javascript
widget.unmount()
```
Unmounts the widget and cleans up resources.

**`update(newOptions)`**
```javascript
widget.update({ placeholder: 'New text' })
```
Updates widget options and re-renders.

**`setContent(content)`**
```javascript
widget.setContent('<h1>Hello</h1><p>World</p>')
```
Set editor content programmatically (HTML string).

**`getContent()`**
```javascript
const content = widget.getContent()
```
Get current editor content as HTML string.

**`clearContent()`**
```javascript
widget.clearContent()
```
Clear all editor content.

**`setPlaceholder(text)`**
```javascript
widget.setPlaceholder('Enter your email...')
```
Change placeholder text dynamically.

**`setMinHeight(height)`**
```javascript
widget.setMinHeight('400px')
```
Change minimum editor height.

**`setMaxHeight(height)`**
```javascript
widget.setMaxHeight('600px')
```
Change maximum editor height.

**`setOptions(options)`**
```javascript
widget.setOptions({
    placeholder: 'New placeholder',
    minHeight: '400px',
    maxHeight: '600px'
})
```
Update multiple options at once.

**`getOptions()`**
```javascript
const options = widget.getOptions()
```
Get current widget options.

### initRichTextEditor Function

```javascript
initRichTextEditor(containerId, options)
```

Convenience function that creates and mounts a widget in one call.

**Returns:** `RichTextEditorWidget` instance

## 📦 Build from Source

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build
```

**Build Output:**
- `dist/rich-text-editor-widget.umd.cjs` - Widget JavaScript (701KB, 220KB gzipped)
- `dist/rich-text-editor-widget.css` - Widget styles (21KB, 5KB gzipped)

## 🎨 Customization

### Custom Styling

Override CSS variables or add custom styles:

```css
.rich-text-editor-widget-wrapper {
    /* Your custom styles */
}

.ProseMirror {
    /* Customize editor content area */
    font-family: 'Your Font', sans-serif;
}
```

### Custom Callbacks

```javascript
const widget = initRichTextEditor('editor', {
    onChange: (content) => {
        // Save to localStorage
        localStorage.setItem('draft', content);
        
        // Update character count
        document.getElementById('count').textContent = content.length;
        
        // Auto-save to server
        fetch('/api/save', {
            method: 'POST',
            body: JSON.stringify({ content })
        });
    }
});
```

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ using React, TipTap, and Vite**
