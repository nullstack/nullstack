async function networkDataFirst(event) {
  const cache = await caches.open(self.context.environment.key);
  const api = event.request.url + '/index.json';
  try {
    const response = await load(event);
    const dataResponse = await extractData(response);
    await cache.put(api, dataResponse);
    return response;
  } catch(error) {
    const fallbackResponse = await cache.match(`/offline-${self.context.environment.key}/index.html`);  
    const cachedDataResponse = await cache.match(api);
    if(cachedDataResponse) {
      return await injectData(fallbackResponse, cachedDataResponse);
    } else {
      return fallbackResponse;
    }
  }
}