import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/my-cashback/',
  plugins: [
    vue(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: [
        'img/*',
      ],
      manifest: {
        name: 'My Cashback',
        short_name: 'My Cashback',
        description: 'Приложение для отслеживания категорий кэшбэков',
        start_url: '/my-cashback/',
        scope: '/my-cashback/',
        display: 'standalone',
        theme_color: '#2563eb',
        background_color: '#94a3b8',
        icons: [
          { src: 'img/cashback-128.png', sizes: '128x128', type: 'image/png' },
          { src: 'img/cashback-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'img/cashback-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webp,ico,woff2,woff,ttf,eot,css}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        navigateFallback: '/my-cashback/index.html',
        navigateFallbackDenylist: [
          new RegExp('/[^/?]+\\.[^/]+$')
        ]
      }
    }),
  ],
})
