import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: Ensures relative paths for Electron packaged apps (file://)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
