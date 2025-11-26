import React from 'react'
import { createRoot } from 'react-dom/client'
import RichTextEditor from './RichTextEditor'
import './index.css'

// Widget class
class RichTextEditorWidget {
  constructor(containerId, options = {}) {
    this.containerId = containerId
    this.options = options
    this.root = null
  }

  mount() {
    const container = document.getElementById(this.containerId)
    if (!container) {
      console.error(`RichTextEditorWidget: Container with id "${this.containerId}" not found`)
      return
    }

    this.root = createRoot(container)
    
    // Wrap RichTextEditor with necessary providers
    const WidgetApp = React.createElement(
      'div',
      { className: 'rich-text-editor-widget-wrapper' },
      React.createElement(RichTextEditor, {
        value: this.options.value || this.options.defaultValue || '',
        onChange: this.options.onChange,
        placeholder: this.options.placeholder || 'Enter your text',
        minHeight: this.options.minHeight || '100px',
        maxHeight: this.options.maxHeight || '300px',
        showDebugInfo: this.options.showDebugInfo || false,
        className: this.options.className || '',
        isModal: this.options.isModal || false
      })
    )
    
    this.root.render(WidgetApp)
  }

  unmount() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
  }

  update(newOptions) {
    this.options = { ...this.options, ...newOptions }
    if (this.root) {
      const WidgetApp = React.createElement(
        'div',
        { className: 'rich-text-editor-widget-wrapper' },
        React.createElement(RichTextEditor, {
          value: this.options.value || this.options.defaultValue || '',
          onChange: this.options.onChange,
          placeholder: this.options.placeholder || 'Enter your text',
          minHeight: this.options.minHeight || '100px',
          maxHeight: this.options.maxHeight || '300px',
          showDebugInfo: this.options.showDebugInfo || false,
          className: this.options.className || '',
          isModal: this.options.isModal || false
        })
      )
      this.root.render(WidgetApp)
    }
  }

  /**
   * Set the editor content programmatically
   * @param {string} content - HTML content to set in the editor
   * @example
   * // Load a template
   * widget.setContent('<h1>Welcome</h1><p>Start here...</p>');
   * 
   * // Load from button click
   * document.getElementById('loadDraft').addEventListener('click', () => {
   *   widget.setContent(localStorage.getItem('draft'));
   * });
   */
  setContent(content) {
    this.options.value = content
    this.update(this.options)
  }

  /**
   * Get the current editor content
   * @returns {string} Current HTML content
   */
  getContent() {
    return this.options.value || ''
  }

  /**
   * Clear the editor content
   */
  clearContent() {
    this.setContent('')
  }

  /**
   * Set the placeholder text programmatically
   * @param {string} placeholder - New placeholder text
   * @example
   * widget.setPlaceholder('Enter your email content...');
   */
  setPlaceholder(placeholder) {
    this.options.placeholder = placeholder
    this.update(this.options)
  }

  /**
   * Set the minimum height programmatically
   * @param {string} minHeight - New minimum height (e.g., '300px')
   * @example
   * widget.setMinHeight('400px');
   */
  setMinHeight(minHeight) {
    this.options.minHeight = minHeight
    this.update(this.options)
  }

  /**
   * Set the maximum height programmatically
   * @param {string} maxHeight - New maximum height (e.g., '500px')
   * @example
   * widget.setMaxHeight('600px');
   */
  setMaxHeight(maxHeight) {
    this.options.maxHeight = maxHeight
    this.update(this.options)
  }

  /**
   * Set multiple options at once
   * @param {object} options - Options to update
   * @example
   * widget.setOptions({
   *   placeholder: 'New placeholder',
   *   minHeight: '400px',
   *   maxHeight: '600px'
   * });
   */
  setOptions(options) {
    this.update(options)
  }

  /**
   * Get current options
   * @returns {object} Current widget options
   */
  getOptions() {
    return { ...this.options }
  }
}

// Auto-initialization function
function initRichTextEditor(containerId, options = {}) {
  const widget = new RichTextEditorWidget(containerId, options)
  widget.mount()
  return widget
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.RichTextEditorWidget = RichTextEditorWidget
  window.initRichTextEditor = initRichTextEditor
  
  // Auto-init if data attributes are found
  document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-rich-text-editor]')
    containers.forEach(container => {
      const placeholder = container.getAttribute('data-placeholder')
      const minHeight = container.getAttribute('data-min-height')
      const maxHeight = container.getAttribute('data-max-height')
      const onChangeCallback = container.getAttribute('data-on-change')
      
      if (container.id) {
        const options = {}
        
        if (placeholder) options.placeholder = placeholder
        if (minHeight) options.minHeight = minHeight
        if (maxHeight) options.maxHeight = maxHeight
        
        // Check if callback function exists in global scope
        if (onChangeCallback && typeof window[onChangeCallback] === 'function') {
          options.onChange = window[onChangeCallback]
        }
        
        initRichTextEditor(container.id, options)
      }
    })
  })
}

export { RichTextEditorWidget, initRichTextEditor }
export default RichTextEditorWidget
