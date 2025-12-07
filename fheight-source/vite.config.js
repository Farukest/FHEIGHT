import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './dist/src',
  server: {
    port: 3001,
    open: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
  build: {
    outDir: '../../dist-vite',
  },
  optimizeDeps: {
    exclude: ['fheight.js', 'vendor.js'],
  },
  plugins: [
    {
      name: 'skip-legacy-js',
      enforce: 'pre',
      transform(code, id) {
        // Skip transformation for legacy browserify bundles
        if (id.endsWith('fheight.js') || id.endsWith('vendor.js')) {
          return { code, map: null };
        }
      },
    },
  ],
});
