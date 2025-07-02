import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rup-api': {
        target: 'https://isb.lkpp.go.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rup-api/, ''),
        secure: false
      }
    }
  }
})
