import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {},
    'Buffer': ['buffer', 'Buffer'],
  },
  optimizeDeps: {
    include: ['gray-matter', 'buffer'],
  },
  build: {
    commonjsOptions: {
      include: [/gray-matter/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: {
          'gray-matter': ['gray-matter'],
          'buffer': ['buffer'],
        },
      },
    },
    target: 'esnext',
    sourcemap: true,
  },
});
