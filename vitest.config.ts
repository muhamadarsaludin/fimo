import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, 'src/test'),
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/mixin/breakpoints" as breakpoints;`,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
})

