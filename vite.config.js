import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
/* export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'vmThreads',
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
  },
}) */

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    watch: false,
    globals: true,
    server: {
      deps: {
        inline: ['@hexlet/chatbot-v2'],
      },
    },
    environment: 'jsdom',
  },
  plugins: [react()],
})
