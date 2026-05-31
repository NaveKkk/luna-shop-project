import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Це налаштування вказує, що @ = папка src
      '@': path.resolve(__dirname, './src'),
    },
  },
})