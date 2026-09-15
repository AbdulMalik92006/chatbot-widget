import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Builds ONE self-contained JS file that any website can load with a
// single <script> tag. React/ReactDOM are bundled in (not externalized)
// because the host page has no idea what React is.
//
//   <script src="https://cdn.example.com/chatbot-widget.embed.js"></script>
//   <script>
//     window.ChatbotWidget.init({ companyId: "elitefit", webhookUrl: "..." });
//   </script>
export default defineConfig({
  plugins: [react()],
  define: {
  'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist-embed',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/embed.jsx'),
      name: 'ChatbotWidgetEmbed',
      formats: ['iife'],
      fileName: () => 'chatbot-widget.embed.js',
    },
    rollupOptions: {
      output: {
        // Everything (React included) goes into one flat file on purpose.
        inlineDynamicImports: true,
      },
    },
  },
});
