// composables/usePush.ts
import { ref } from 'vue'

const vapidPublicKey = '<PUT_YOUR_VAPID_PUBLIC_KEY_HERE>'

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export async function subscribeToPush() {
  if (!('serviceWorker' in navigator)) throw new Error('No serviceWorker')
  if (!('PushManager' in window)) throw new Error('No PushManager')

  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  })
  // send subscription to your server
  await fetch('/api/save-subscription', { method: 'POST', body: JSON.stringify(sub), headers: { 'Content-Type': 'application/json' } })
  return sub
}

export async function unsubscribePush() {
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  if (sub) {
    await sub.unsubscribe()
    await fetch('/api/remove-subscription', { method: 'POST', body: JSON.stringify({ endpoint: sub.endpoint }), headers: { 'Content-Type': 'application/json' } })
  }
}