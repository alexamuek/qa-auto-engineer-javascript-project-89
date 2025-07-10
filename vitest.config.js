import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'vmThreads',
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    css: true,
    globals: true,
  },
})
