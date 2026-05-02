import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const backendHost = env.VITE_BACKEND_HOST || '127.0.0.1'
  const backendPort = env.VITE_BACKEND_PORT || '8001'

  return {
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
        '/api-chat': {
          target: `http://${backendHost}:${backendPort}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-chat/, '')
        }
      }
    }
  }
})

