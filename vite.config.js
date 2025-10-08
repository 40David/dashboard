import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy only used during local development to avoid CORS
    proxy: {
      '/Data': {
        target: process.env.VITE_BACKEND_URL, // your backend URL
        changeOrigin: true,
        rewrite: path => path.replace(/data/, '/data'),
      },
    },
  },
})
