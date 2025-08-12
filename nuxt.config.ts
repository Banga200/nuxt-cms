// https://nuxt.com/docs/api/configuration/nuxt-config
import { VitePWA } from 'vite-plugin-pwa'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['offline.html', 'icons/icon-192.png', 'icons/icon-512.png'],
        manifest: {
          name: 'Nuxt PWA Example',
          short_name: 'NuxtPWA',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#4f46e5',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        },
        workbox: {
          navigateFallback: '/offline.html',
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-resources',
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 }
              }
            },
            {
              urlPattern: /^https:\/\/api\.example\.com\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
              }
            }
          ]
        }
      })
    ]
  }
})
