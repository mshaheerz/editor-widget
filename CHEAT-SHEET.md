# 🎯 Rich Text Editor Widget - Method Cheat Sheet

## 📦 Initialization

```javascript
// Method 1: Auto-init with data attributes
<div id="editor" data-rich-text-editor></div>

// Method 2: Programmatic
const widget = initRichTextEditor('editor', options);

// Method 3: Class-based
const widget = new RichTextEditorWidget('editor', options);
widget.mount();
```

---

## 📝 Content Methods

```javascript
// Set content
widget.setContent('<h1>Hello</h1><p>World</p>');

// Get content
const html = widget.getContent();

// Clear content
widget.clearContent();
```

---

## ⚙️ Option Methods

```javascript
// Change placeholder
widget.setPlaceholder('Enter your text...');

// Change height
widget.setMinHeight('400px');
widget.setMaxHeight('600px');

// Update multiple options
widget.setOptions({
    placeholder: 'New text',
    minHeight: '400px',
    maxHeight: '600px'
});

// Get current options
const options = widget.getOptions();
```

---

## 🔄 Lifecycle Methods

```javascript
// Mount widget
widget.mount();

// Unmount widget
widget.unmount();

// Update options (low-level)
widget.update(newOptions);
```

---

## 💡 Quick Examples

### Load Template on Button Click
```javascript
document.getElementById('loadBtn').addEventListener('click', () => {
    widget.setContent(templateHTML);
    widget.setPlaceholder('Editing template...');
});
```

### Auto-Save
```javascript
const widget = initRichTextEditor('editor', {
    onChange: (content) => {
        localStorage.setItem('draft', content);
    }
});
```

### Mode Switching
```javascript
function switchToEmailMode() {
    widget.setOptions({
        placeholder: 'Compose email...',
        minHeight: '400px',
        value: emailTemplate
    });
}
```

### Load from API
```javascript
async function loadContent() {
    const res = await fetch('/api/content');
    const data = await res.json();
    widget.setContent(data.html);
}
```

---

## 📋 All Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | string | `'Enter your text'` | Placeholder text |
| `minHeight` | string | `'100px'` | Minimum height |
| `maxHeight` | string | `'300px'` | Maximum height |
| `value` | string | `''` | Content (HTML) |
| `onChange` | function | `null` | Change callback |
| `className` | string | `''` | CSS classes |

---

## 🎨 Method Chaining

```javascript
widget
    .setPlaceholder('New text')
    .setMinHeight('400px')
    .setContent('<h1>Hello</h1>');
```

---

## 📁 Example Files

- `simple-example.html` - Basic usage
- `prepopulate-example.html` - Load content from events
- `dynamic-options-example.html` - Change options dynamically
- `dist-usage.html` - All initialization methods

---

**Quick Start:**
```html
<link rel="stylesheet" href="./dist/rich-text-editor-widget.css">
<div id="editor" data-rich-text-editor></div>
<script src="./dist/rich-text-editor-widget.umd.cjs"></script>
```

**That's it! The editor auto-initializes.** ✨
