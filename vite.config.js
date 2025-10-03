import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    proxy: {
      '/dashboard': {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dashboard/, '/dashboard'),
      },
       '/predict': {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/predict/, '/predict'),
      },
    },
  },
})
