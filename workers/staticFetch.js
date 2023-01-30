function staticStrategy(event) {
  event.waitUntil(
    (async function () {
      if (event.request.method !== 'GET') return
      const url = new URL(event.request.url)
      for (const matcher of self.context.worker.staleWhileRevalidate) {
        if (match(matcher, url)) {
          return event.respondWith(staleWhileRevalidate(event))
        }
      }
      for (const matcher of self.context.worker.cacheFirst) {
        if (match(matcher, url)) {
          return event.respondWith(cacheFirst(event))
        }
      }
      if (url.origin !== location.origin) return
      if (url.pathname.indexOf('/nullstack/') > -1) {
        return event.respondWith(networkFirst(event))
      }
      if (url.searchParams?.get('fingerprint') === self.context.environment.key) {
        return event.respondWith(cacheFirst(event))
      }
      if (url.pathname.indexOf('.') > -1) {
        return event.respondWith(staleWhileRevalidate(event))
      }
      if (url.pathname === '/') {
        return event.respondWith(networkFirst(event))
      }
      event.respondWith(networkDataFirst(event))
    })(),
  )
}

self.addEventListener('fetch', staticStrategy)
