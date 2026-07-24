import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

// Multi-page build: the keeper landing (index.html) and the live demo (demo.html)
// are kept exactly as authored — Vite just bundles their assets and emits a static
// `dist/` for Hostinger. `base: './'` makes the output work from any path (domain
// root or a subfolder). React is wired in so this is a standard Vite + React app.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        demo: resolve(root, 'demo.html'),
      },
    },
  },
})
