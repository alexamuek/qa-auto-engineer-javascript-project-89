import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
