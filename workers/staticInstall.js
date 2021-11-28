function install(event) {
  const urls = [
    '/',
    ...self.context.worker.preload,
    ...self.context.worker.preload.map(toAPI),
    '/manifest.json'
  ];
  event.waitUntil(async function () {
    const cache = await caches.open(self.context.environment.key);
    await cache.addAll([...new Set(urls)]);
    const homeResponse = await cache.match('/');
    const homeDataResponse = await extractData(homeResponse);
    await cache.put('/index.json', homeDataResponse);
    self.skipWaiting();
  }());
}

self.addEventListener('install', install);