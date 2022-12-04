async function cacheFirst(event) {
  const cache = await caches.open(self.context.environment.key)
  const cachedResponse = await cache.match(event.request)
  if (cachedResponse) return cachedResponse
  const response = await load(event)
  await cache.put(event.request, response.clone())
  return response
}
