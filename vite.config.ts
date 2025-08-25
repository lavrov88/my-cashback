import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/my-cashback/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      // includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'My Cashback',
        short_name: 'My Cashback',
        description: 'Приложение для отслеживания категорий кэшбэков',
        start_url: '/my-cashback/',
        scope: '/my-cashback/',
        display: 'standalone',
        theme_color: '#cbd5e1',
        background_color: '#f1f5f9',
        icons: [
          { src: '/img/cashback-64.png', sizes: '64x64', type: 'image/png' },
          { src: '/img/cashback-128.png', sizes: '128x128', type: 'image/png' },
          { src: '/img/cashback-256.png', sizes: '256x256', type: 'image/png' },
          { src: '/img/cashback-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/img/cashback-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      // workbox: {
      //   // Примеры Runtime Caching стратегий (workbox)
      //   runtimeCaching: [
      //     {
      //       urlPattern: /^https:\/\/your-cdn\.example\/.*\.(?:png|jpg|jpeg|svg|webp)$/,
      //       handler: 'CacheFirst',
      //       options: {
      //         cacheName: 'cdn-images',
      //         expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }
      //       }
      //     },
      //     {
      //       urlPattern: /^https:\/\/api\.yourdomain\.com\/.*$/,
      //       handler: 'NetworkFirst',
      //       options: {
      //         cacheName: 'api-responses',
      //         networkTimeoutSeconds: 10,
      //         expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }
      //       }
      //     }
      //   ]
      // }
    }),
  ],
})
