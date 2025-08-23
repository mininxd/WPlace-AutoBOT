import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      fileName: 'Auto-Image',
      formats: ['iife'],
      name: 'AutoImage',
    },
    outDir: 'dist',
    minify: true,
    rollupOptions: {
      output: {
        // The name of the global variable to access the bundle
        // (required for IIFE format)
        name: 'AutoImage',
        // Ensure the output file is named exactly `Auto-Image.js`
        entryFileNames: 'Auto-Image.js',
        assetFileNames: '[name].[ext]',
      }
    }
  }
})
