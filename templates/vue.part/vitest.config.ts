import { mergeConfig } from 'vite'
import viteConfig from './vite.config'
import { defineConfig } from 'vitest/config'
import type { UserConfigFn } from 'vite'

export default mergeConfig(
  (<UserConfigFn>viteConfig)({ command: 'serve', mode: 'development' }),
  defineConfig({
    test: {
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'json', 'html']
      }
    }
  })
)
