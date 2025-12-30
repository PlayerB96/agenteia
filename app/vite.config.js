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
      }
    }
  }
})

