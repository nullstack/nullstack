export default function extractLocation(originalUrl) {
  let [path, search] = originalUrl.split('?');
  if(path !== '/' && path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  let url = path;
  if(search) {
    url += '?' + search;
  }
  return {path, search, url};
}