async function networkOnly(event) {
  try {
    return await load(event);
  } catch(error) {
    const cache = await caches.open(self.context.environment.key);
    return await cache.match(`/offline-${self.context.environment.key}`);
  }
}