function install(event) {
  const urls = [
    '/',
    ...self.context.worker.preload,
    '/offline-' + self.context.environment.key,
    '/client-' + self.context.environment.key + '.css',
    '/client-' + self.context.environment.key + '.js',
    '/manifest-' + self.context.environment.key + '.json'
  ];
  event.waitUntil(async function() {
    const cache = await caches.open(self.context.environment.key);
    await cache.addAll([...new Set(urls)]);
    self.skipWaiting();
  }());
}

self.addEventListener('install', install);