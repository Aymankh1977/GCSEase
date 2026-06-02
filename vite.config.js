import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During `netlify dev` the functions are served on /.netlify/functions.
// During plain `vite` dev we proxy those calls to the Netlify dev server (port 8888)
// so the app behaves identically in both modes.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
