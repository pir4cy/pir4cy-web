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
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.md')) {
            // Keep markdown files in a content directory
            return 'content/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    target: 'esnext',
    sourcemap: true,
    assetsInlineLimit: 0, // Don't inline any assets
    copyPublicDir: true,
  },
});
