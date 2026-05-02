import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const backendHost = env.VITE_BACKEND_HOST || '127.0.0.1'
  const backendPort = env.VITE_BACKEND_PORT || '8001'

  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api-chat': {
          target: `http://${backendHost}:${backendPort}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-chat/, '')
        }
      }
    }
  }
})

