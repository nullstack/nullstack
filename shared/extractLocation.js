export default function extractLocation(originalUrl) {
  const urlFragments = originalUrl.split('#')
  let hash = urlFragments[1]
  const targetFragments = urlFragments[0].split('?')
  let path = targetFragments[0]
  const search = targetFragments[1]
  if (path !== '/' && path.endsWith('/')) {
    path = path.substring(0, path.length - 1)
  }
  let url = path
  if (search) {
    url += `?${search}`
  }
  let urlWithHash = url
  if (hash) {
    urlWithHash += `#${hash}`
  }
  if (hash === undefined) {
    hash = ''
  }
  return { path, search, url, urlWithHash, hash }
}
