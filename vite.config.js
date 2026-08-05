// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 기본값 500을 1600 정도로 넉넉하게 상향 조정
    chunkSizeWarningLimit: 1600,
  }
})