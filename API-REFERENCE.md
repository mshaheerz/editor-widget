# Rich Text Editor Widget - API Quick Reference

## 📚 Complete Method Reference

### Initialization Methods

#### 1. Auto-Initialization (Data Attributes)
```html
<div id="editor" 
     data-rich-text-editor 
     data-placeholder="Type here..."
     data-min-height="300px"
     data-max-height="500px"
     data-on-change="handleChange"></div>
```

#### 2. Programmatic Initialization
```javascript
const widget = initRichTextEditor('editor', {
    placeholder: 'Enter text...',
    minHeight: '300px',
    maxHeight: '500px',
    onChange: (content) => console.log(content)
});
```

#### 3. Class-Based Initialization
```javascript
const widget = new RichTextEditorWidget('editor', {
    placeholder: 'Enter text...',
    minHeight: '300px'
});
widget.mount();
```

---

## 🎯 Content Management Methods

### `setContent(content)`
Set editor content programmatically
```javascript
// Load a template
widget.setContent('<h1>Welcome</h1><p>Start here...</p>');

// Load from button click
document.getElementById('loadBtn').addEventListener('click', () => {
    widget.setContent(localStorage.getItem('draft'));
});

// Load from API
fetch('/api/content')
    .then(res => res.json())
    .then(data => widget.setContent(data.html));
```

### `getContent()`
Get current editor content
```javascript
const currentContent = widget.getContent();
console.log(currentContent); // Returns HTML string
```

### `clearContent()`
Clear all editor content
```javascript
widget.clearContent();
```

---

## ⚙️ Option Setter Methods

### `setPlaceholder(text)`
Change placeholder text dynamically
```javascript
// Change based on mode
widget.setPlaceholder('Compose your email...');

// Context-aware placeholder
if (userMode === 'blog') {
    widget.setPlaceholder('Write your blog post...');
} else {
    widget.setPlaceholder('Take notes...');
}
```

### `setMinHeight(height)`
Change minimum height
```javascript
widget.setMinHeight('400px');

// Responsive sizing
if (window.innerWidth < 768) {
    widget.setMinHeight('200px');
} else {
    widget.setMinHeight('500px');
}
```

### `setMaxHeight(height)`
Change maximum height
```javascript
widget.setMaxHeight('600px');
```

### `setOptions(options)`
Update multiple options at once
```javascript
// Switch to compact mode
widget.setOptions({
    placeholder: 'Quick note...',
    minHeight: '150px',
    maxHeight: '150px'
});

// Switch to expanded mode
widget.setOptions({
    placeholder: 'Write extensively...',
    minHeight: '600px',
    maxHeight: '800px'
});

// Email composer mode
widget.setOptions({
    placeholder: 'Compose email...',
    minHeight: '400px',
    maxHeight: '600px',
    value: emailTemplate
});
```

### `getOptions()`
Get current widget options
```javascript
const currentOptions = widget.getOptions();
console.log(currentOptions);
// {
//   placeholder: 'Enter text...',
//   minHeight: '300px',
//   maxHeight: '500px',
//   value: '<p>Current content</p>',
//   ...
// }
```

---

## 🔄 Lifecycle Methods

### `mount()`
Mount the widget to DOM
```javascript
const widget = new RichTextEditorWidget('editor', options);
widget.mount();
```

### `unmount()`
Unmount and cleanup
```javascript
widget.unmount();
```

### `update(options)`
Update widget with new options (lower-level method)
```javascript
widget.update({
    placeholder: 'New placeholder',
    minHeight: '400px'
});
```

---

## 💡 Real-World Use Cases

### 1. Mode Switching
```javascript
const modes = {
    email: {
        placeholder: 'Compose your email...',
        minHeight: '400px',
        maxHeight: '600px',
        value: emailTemplate
    },
    blog: {
        placeholder: 'Write your blog post...',
        minHeight: '600px',
        maxHeight: '800px',
        value: blogTemplate
    },
    notes: {
        placeholder: 'Take quick notes...',
        minHeight: '200px',
        maxHeight: '300px',
        value: ''
    }
};

function switchMode(mode) {
    widget.setOptions(modes[mode]);
}
```

### 2. Template System
```javascript
const templates = {
    welcome: '<h1>Welcome!</h1><p>Get started...</p>',
    announcement: '<h2>Announcement</h2><p>Important news...</p>',
    newsletter: '<h1>Newsletter</h1><p>This month...</p>'
};

document.getElementById('templateSelect').addEventListener('change', (e) => {
    const template = e.target.value;
    if (templates[template]) {
        widget.setContent(templates[template]);
        widget.setPlaceholder(`Editing ${template} template...`);
    }
});
```

### 3. Auto-Save with Visual Feedback
```javascript
let saveTimeout;

const widget = initRichTextEditor('editor', {
    onChange: (content) => {
        // Clear previous timeout
        clearTimeout(saveTimeout);
        
        // Update placeholder to show saving status
        widget.setPlaceholder('Saving...');
        
        // Debounce save
        saveTimeout = setTimeout(() => {
            localStorage.setItem('draft', content);
            widget.setPlaceholder('All changes saved ✓');
            
            // Reset placeholder after 2 seconds
            setTimeout(() => {
                widget.setPlaceholder('Keep writing...');
            }, 2000);
        }, 1000);
    }
});
```

### 4. Responsive Height
```javascript
function adjustEditorHeight() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile) {
        widget.setOptions({
            minHeight: '200px',
            maxHeight: '300px'
        });
    } else if (isTablet) {
        widget.setOptions({
            minHeight: '300px',
            maxHeight: '500px'
        });
    } else {
        widget.setOptions({
            minHeight: '500px',
            maxHeight: '700px'
        });
    }
}

window.addEventListener('resize', adjustEditorHeight);
adjustEditorHeight(); // Initial call
```

### 5. Context-Aware Placeholder
```javascript
// Change placeholder based on what user is doing
document.getElementById('replyBtn').addEventListener('click', () => {
    widget.setPlaceholder('Type your reply...');
    widget.setContent(''); // Clear for new reply
});

document.getElementById('editBtn').addEventListener('click', () => {
    widget.setPlaceholder('Edit your message...');
    widget.setContent(existingMessage); // Load existing
});

document.getElementById('draftBtn').addEventListener('click', () => {
    widget.setPlaceholder('Continue your draft...');
    widget.setContent(localStorage.getItem('draft'));
});
```

---

## 📋 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | string | `'Enter your text'` | Placeholder text |
| `minHeight` | string | `'100px'` | Minimum editor height |
| `maxHeight` | string | `'300px'` | Maximum editor height |
| `value` | string | `''` | Initial/current content (HTML) |
| `defaultValue` | string | `''` | Default content (HTML) |
| `onChange` | function | `null` | Callback when content changes |
| `className` | string | `''` | Additional CSS classes |
| `showDebugInfo` | boolean | `false` | Show debug information |
| `isModal` | boolean | `false` | Enable modal mode |

---

## 🎨 Method Chaining

Methods return the widget instance for chaining:

```javascript
widget
    .setPlaceholder('New placeholder')
    .setMinHeight('400px')
    .setMaxHeight('600px')
    .setContent('<h1>Hello</h1>');
```

---

## 🔍 Debugging

```javascript
// Log current state
console.log('Content:', widget.getContent());
console.log('Options:', widget.getOptions());

// Enable debug mode
widget.setOptions({ showDebugInfo: true });
```

---

## 📦 Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="./dist/rich-text-editor-widget.css">
</head>
<body>
    <div id="editor"></div>
    
    <button id="loadTemplate">Load Template</button>
    <button id="save">Save</button>
    <button id="clear">Clear</button>
    
    <script src="./dist/rich-text-editor-widget.umd.cjs"></script>
    <script>
        // Initialize
        const widget = initRichTextEditor('editor', {
            placeholder: 'Start typing...',
            minHeight: '300px',
            onChange: (content) => {
                console.log('Content updated');
            }
        });
        
        // Load template
        document.getElementById('loadTemplate').addEventListener('click', () => {
            widget.setContent('<h1>Template</h1><p>Content here...</p>');
            widget.setPlaceholder('Editing template...');
        });
        
        // Save
        document.getElementById('save').addEventListener('click', () => {
            const content = widget.getContent();
            localStorage.setItem('saved', content);
            widget.setPlaceholder('Saved! ✓');
        });
        
        // Clear
        document.getElementById('clear').addEventListener('click', () => {
            widget.clearContent();
            widget.setPlaceholder('Start fresh...');
        });
    </script>
</body>
</html>
```

---

**Made with ❤️ - All methods are chainable and work together seamlessly!**
