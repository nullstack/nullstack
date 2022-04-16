function install(event) {
  const urls = [
    '/',
    ...self.context.worker.preload.map(withAPI),
    '/manifest.webmanifest',
    `/client.css?fingerprint=${self.context.environment.key}`,
    `{{SCRIPTS}}`,
    `/nullstack/${self.context.environment.key}/offline/index.html`
  ].flat();
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