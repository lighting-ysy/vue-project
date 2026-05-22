import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  //http://portal.it.sunsheen.cn/api/v1/register/selectCaseList
  base: '/aiads/',
  server: {
    port: 3001,
    proxy: {
      '/cwaiads/service/api/': {
        target: 'http://portal.it.sunsheen.cn/cwaiads/service/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cwaiads\/service\/api/, '')
      },
      '/api/v1/': {
        //target: 'http://portal.it.sunsheen.cn/api/v1/',
        target: 'http://192.168.8.10:8000/api/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '')
      },
      '/fuo-aiads/': {
        //target: 'http://portal.it.sunsheen.cn/api/v1/',
        target: 'http://portal.it.sunsheen.cn/fuo-aiads/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fuo-aiads/, '')
      }
    }
  }
})
