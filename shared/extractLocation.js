export default function extractLocation(originalUrl) {
  let [target, hash] = originalUrl.split('#');
  let [path, search] = target.split('?');
  if(path !== '/' && path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  let url = path;
  if(search) {
    url += '?' + search;
  }
  let urlWithHash = url;
  if(hash) {
    urlWithHash += '#' + hash;
  }
  if(hash === undefined) {
    hash = '';
  }
  return {path, search, url, urlWithHash, hash};
}