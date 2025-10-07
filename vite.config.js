import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy only used during local development to avoid CORS
    proxy: {
      '/Data/ESP32_001': {
        target: process.env.VITE_BACKEND_URL, // your backend URL
        changeOrigin: true,
        rewrite: path => path.replace(/^\/Data\/ESP32_001/, '/Data/ESP32_001'),
      },
    },
  },
  define: {
    'process.env': process.env,
  },
})
