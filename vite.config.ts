import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['coffee-icon.svg'],
      manifest: {
        name: 'Coffee Journey',
        short_name: 'Coffee',
        description: '一杯ずつ、コーヒーに詳しくなる学習アプリ',
        theme_color: '#1f4a3d',
        background_color: '#f5efe3',
        display: 'standalone',
        start_url: './',
        icons: [{ src: './coffee-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'] }
    })
  ],
  test: { environment: 'jsdom', globals: true }
})
