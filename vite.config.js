import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    lib: {
      entry: 'src/embed.jsx',
      name: 'ChatbotWidget',
      fileName: 'chatbot-widget.embed',
      formats: ['iife'],
    },

    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },

  server: {
    port: 5173,
  },
});