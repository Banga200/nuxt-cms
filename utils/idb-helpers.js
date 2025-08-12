import { get, set, del } from 'idb-keyval'

const QUEUE_KEY = 'offline-queue-comments'

export async function queueComment(comment) {
  const list = (await get(QUEUE_KEY)) || []
  list.push({ id: Date.now(), ...comment })
  await set(QUEUE_KEY, list)
}

export async function getQueuedComments() {
  return (await get(QUEUE_KEY)) || []
}

export async function clearQueuedComment(id) {
  const list = (await get(QUEUE_KEY)) || []
  const filtered = list.filter(i => i.id !== id)
  await set(QUEUE_KEY, filtered)
}

export async function clearAllQueued() {
  await set(QUEUE_KEY, [])
}