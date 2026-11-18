import { defineConfig } from 'vite'

// Project Pages: set base to '/<repo>/' after the GitHub repo name is known.
// Default '/' works for user site and local preview; CI can override with env.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
