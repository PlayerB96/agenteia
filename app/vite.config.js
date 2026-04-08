import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api-worker': {
        target: 'https://worker-agent-config.soporteti-41b.workers.dev',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-worker/, '')
      },
      // 👇 NUEVO proxy para tu backend local
      '/api-chat': {
        target: 'http://172.16.0.240:8001',
        changeOrigin: true,
        secure: false, // importante porque es http
        rewrite: (path) => path.replace(/^\/api-chat/, '')
      }
    }
  }
})

