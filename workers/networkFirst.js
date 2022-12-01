async function networkFirst(event) {
  const cache = await caches.open(self.context.environment.key)
  try {
    const networkResponse = await load(event)
    await cache.put(event.request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    return cache.match(event.request)
  }
}
