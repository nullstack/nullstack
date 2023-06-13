function activate(event) {
  event.waitUntil(
    (async function () {
      const cacheNames = await caches.keys()
      const cachesToDelete = cacheNames.filter((cacheName) => cacheName !== self.context.environment.key)
      await Promise.all(cachesToDelete.map((cacheName) => caches.delete(cacheName)))
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable()
      }
      self.clients.claim()
    })(),
  )
}

self.addEventListener('activate', activate)
