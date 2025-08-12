// plugins/pwa.client.ts
import { registerSW } from 'virtual:pwa-register'
import { useEventListener } from '@vueuse/core'
import { defineNuxtPlugin } from '#app'
export default defineNuxtPlugin(() => {
  if (process.client) {
    const updateSW = registerSW({ immediate: true })

    // Install prompt handling
    let deferredPrompt: any = null
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      // You may emit an event or store this in a pinia store so your UI can show "Install"
      window.dispatchEvent(new CustomEvent('pwa:can-install'))
    })

    // Expose helpers to window for quick dev usage
    (window as any).__pwaHelpers = {
      promptInstall: async () => {
        if (!deferredPrompt) return null
        const result = await deferredPrompt.prompt()
        deferredPrompt = null
        return result
      },
      updateSW
    }
  }
})