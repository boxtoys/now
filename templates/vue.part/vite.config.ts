import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, './src/index.ts'),
        formats: ['cjs', 'es'],
        name: 'Bundle',
        fileName: (format) => format === 'cjs' ? 'index.cjs.js' : format === 'es' ? 'index.esm.mjs' : ''
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    },
    plugins: [vue(), vueJsx()]
  }
})
