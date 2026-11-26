import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import relativiseImages from './build/relative-images.js'

export default defineConfig({
  plugins: [react(), relativiseImages()],
  // Relative asset paths so the built bundle also runs from a plain file:// folder.
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    hmr: { clientPort: 443, protocol: 'wss' },
  },
  preview: { host: '0.0.0.0', port: 4173, strictPort: true, allowedHosts: true },
})
