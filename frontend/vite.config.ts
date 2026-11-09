import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [vue()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: { '/api': { target: env.BACKEND_PROXY_URL || 'http://localhost:8080', changeOrigin: true } },
    },
  }
})
