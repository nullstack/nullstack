function dynamicStrategy(event) {

  const url = new URL(event.request.url);

  if(url.origin !== location.origin) return;
  if(event.request.method !== 'GET') return;

  if(url.pathname.indexOf(self.context.environment.key) > -1) {
    return event.respondWith(cacheFirst(event));
  }

  if(url.pathname.indexOf('.') > -1) {
    return event.respondWith(staleWhileRevalidate(event));
  }

  event.respondWith(networkOnly(event));

}

self.addEventListener('fetch', dynamicStrategy);