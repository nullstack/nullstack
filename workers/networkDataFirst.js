/* eslint-disable nullstack/no-unused-vars */
/* eslint-disable nullstack/no-undef */
async function networkDataFirst(event) {
  const cache = await caches.open(self.context.environment.key)
  const url = new URL(event.request.url)
  const api = `${url.pathname}/index.json`
  try {
    const response = await load(event)
    const dataResponse = await extractData(response)
    await cache.put(api, dataResponse)
    return response
  } catch (error) {
    const cachedDataResponse = await cache.match(url)
    return cachedDataResponse || cache.match(`/nullstack/${self.context.environment.key}/offline/index.html`)
  }
}
