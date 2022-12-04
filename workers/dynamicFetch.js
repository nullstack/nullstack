function dynamicStrategy(event) {
  event.waitUntil(
    (async function () {
      const url = new URL(event.request.url)
      if (url.origin !== location.origin) return
      if (event.request.method !== 'GET') return
      if (url.pathname.indexOf('/nullstack/') > -1) {
        return event.respondWith(networkFirst(event))
      }
      if (url.pathname.indexOf(self.context.environment.key) > -1) {
        return event.respondWith(cacheFirst(event))
      }
      if (url.pathname.indexOf('.') > -1) {
        return event.respondWith(staleWhileRevalidate(event))
      }
      event.respondWith(networkFirst(event))
    })(),
  )
}

self.addEventListener('fetch', dynamicStrategy)
