function install(event) {
  const urls = [
    '/',
    ...self.context.worker.preload,
    '/manifest.webmanifest',
    `/client.css?fingerprint=${self.context.environment.key}`,
    `{{SCRIPTS}}`
  ];
  event.waitUntil(async function () {
    const cache = await caches.open(self.context.environment.key);
    await cache.addAll([...new Set(urls)]);
    self.skipWaiting();
  }());
}

self.addEventListener('install', install);