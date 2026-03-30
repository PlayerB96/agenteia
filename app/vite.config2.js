import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api-chat': {
        target: 'http://172.16.0.240:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-chat/, '')
      }
    }
  }
})

