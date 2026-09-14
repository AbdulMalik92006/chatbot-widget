import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Builds the widget as an installable npm package.
// React/ReactDOM are externalized (peerDependencies) since the consuming
// app already provides them. Usage:
//   import { ChatWidget, defaultConfig } from '@yourorg/chatbot-widget';
//   import '@yourorg/chatbot-widget/style.css';
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/widget/index.js'),
      name: 'ChatbotWidget',
      fileName: (format) => `chatbot-widget.${format === 'es' ? 'es' : 'cjs'}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'style.css' ? 'style.css' : assetInfo.name,
      },
    },
  },
});
