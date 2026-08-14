import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://${import.meta.env.VITE_API_URL}', // <-- your backend port
        changeOrigin: true,
      }
    }
  }
})