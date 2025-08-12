self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Notification', body: 'You have a message.' }
  const title = data.title || 'Notification'
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192.png',
    data: data.url || '/'
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})

// Background sync example: tag = 'sync-post-comment'
self.addEventListener('sync', event => {
  if (event.tag === 'sync-post-comment') {
    event.waitUntil(syncComments())
  }
})

async function syncComments() {
  try {
    // read queued comments from IndexedDB (implementation depends on your helper)
    const comments = await readAllQueuedComments() // you'll implement this with idb-keyval
    for (const c of comments) {
      try {
        await fetch('https://api.example.com/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(c)
        })
        await deleteQueuedComment(c.id)
      } catch (err) {
        console.error('Failed to sync comment', err)
      }
    }
  } catch (err) {
    console.error('syncComments error', err)
  }
}

// Placeholder functions — provide concrete implementations in a shared idb helper file
async function readAllQueuedComments() { return [] }
async function deleteQueuedComment(id) { }