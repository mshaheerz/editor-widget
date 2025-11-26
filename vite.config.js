import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget.jsx'),
      name: 'RichTextEditorWidget',
      fileName: 'rich-text-editor-widget',
      formats: ['umd'], // Universal Module Definition for widgets
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        // Inline all dependencies into single file
        inlineDynamicImports: true,
        // Ensure all assets are inlined
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') return 'rich-text-editor-widget.css';
          return assetInfo.name;
        },
      },
    },
    // Ensure CSS is inlined
    cssCodeSplit: false,
    // Minify for production
    minify: 'esbuild',
    // Generate single file
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
