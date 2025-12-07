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
});
