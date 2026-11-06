import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The app calls /ol/... and /covers/... on its own domain.
// In dev, Vite forwards them to Open Library. On Vercel, vercel.json does the same.
// (Some networks block openlibrary.org, and this way the browser only ever talks to our own site.)
const openLibraryProxy = {
  '/ol': {
    target: 'https://openlibrary.org',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/ol/, ''),
  },
  '/covers': {
    target: 'https://covers.openlibrary.org',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/covers/, ''),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: openLibraryProxy },
  preview: { proxy: openLibraryProxy },
})
