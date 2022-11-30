/* eslint-disable nullstack/no-unused-vars */
async function load(event) {
  const response = await event.preloadResponse
  if (response) return response
  return fetch(event.request)
}
