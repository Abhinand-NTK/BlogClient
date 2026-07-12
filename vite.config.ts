import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split heavy libraries so the initial bundle stays lean.
        // Only split the stable, always-used vendors. The markdown +
        // syntax-highlighter code is left to Rollup so PrismAsync's per-language
        // grammars split into their own on-demand chunks.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query', 'axios'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
