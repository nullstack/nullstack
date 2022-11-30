/* eslint-disable nullstack/no-undef */
/* eslint-disable nullstack/no-unused-vars */
async function staleWhileRevalidate(event) {
  const cache = await caches.open(self.context.environment.key)
  const cachedResponse = await cache.match(event.request)
  const networkResponsePromise = load(event)
  event.waitUntil(
    (async function () {
      const networkResponse = await networkResponsePromise
      await cache.put(event.request, networkResponse.clone())
    })(),
  )
  return cachedResponse || networkResponsePromise
}
