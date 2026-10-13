import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.dev'],
    proxy: {
      '/api': {
        target: 'http://backend:3001',
        changeOrigin: true,
        xfwd: true,
      },
      '/health': {
        target: 'http://backend:3001',
        changeOrigin: true,
        xfwd: true,
      },
    },
  },
});
