import getQueryStringParams from '../shared/getQueryStringParams';

const paramsProxyHandler = {
  get(target, name) {
    if(target[name] === false) return false;
    return target[name] || '';
  }
}

export function generateParams(url) {
  const params = getQueryStringParams(url);
  return new Proxy(params, paramsProxyHandler);
}