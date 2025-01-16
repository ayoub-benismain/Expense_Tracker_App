import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react-icons/md'] // Add the external module here
    }
  }
});
export default {
  build: {
    rollupOptions: {
      external: ['react-icons/md']
    }
  }
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
