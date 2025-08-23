import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      fileName: 'Auto-Image',
      formats: ['es'],
    },
    outDir: './',
    minify: true,
    rollupOptions: {
      output: {
        entryFileNames: 'Auto-Image.js',
        assetFileNames: '[name].[ext]',
        banner: '(async () => {',
        footer: '})();',
      }
    }
  }
})
