import { useState } from 'react'
import RichTextEditor from './RichTextEditor'

function App() {
  // State to hold the HTML content of the editor
  // test
  const [content, setContent] = useState('<p>Hello World</p>')

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Rich Text Editor Demo</h1>
      
      <div className="mb-8">
        {/* 
          RichTextEditor Component Usage:
          - value: The current HTML content (controlled component).
          - onChange: Callback function that receives the new HTML content.
          - placeholder: Text to show when empty.
          - minHeight: Minimum height of the editor area.
          - showDebugInfo: Optional boolean to show raw HTML output in console/UI.
        */}
        <RichTextEditor 
          value={content} 
          onChange={setContent} 
          placeholder="Start typing..."
          minHeight="300px"
          showDebugInfo={true}
        />
      </div>
      
      {/* Display the output HTML for demonstration purposes */}
      <div className="bg-slate-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Output HTML:</h2>
        <pre className="whitespace-pre-wrap break-all text-sm font-mono bg-white p-4 rounded border overflow-auto max-h-64">
          {content}
        </pre>
      </div>
    </div>
  )
}

export default App
