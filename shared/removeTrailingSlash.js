export default function removeTrailingSlash(url) {
  if(url !== '/' && url.endsWith('/')) {
    return url.substring(0, url.length - 1);
  }
  return url;
}