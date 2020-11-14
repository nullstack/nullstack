import router from './router';
import getQueryStringParams from '../shared/getQueryStringParams';

const paramsProxyHandler = {
  set(target, name, value) {
    const serializedValue = value && value.toJSON !== undefined ? value.toJSON() : value;
    target[name] = serializedValue;
    if(!router._segments[name]) {
      const keys = Object.keys(target);
      if(!keys.includes(name)) {
        keys.push(name);
      }
      const search = keys.map((key) => {
        const delta = key == name ? serializedValue : target[key];
        if(delta === false || !!delta) {
          return `${key}=${delta}`;
        } else {
          return '';
        }
      }).filter((segment) => !!segment).join('&');
      router.url = window.location.pathname + (search ? '?' : '') + search;
    }
    return true;
  },
  get(target, name) {
    return target[name] || '';
  }
}

export function generateParams(query) {
  const params = getQueryStringParams(query);
  router._resetSegments();
  return new Proxy(params, paramsProxyHandler);
}