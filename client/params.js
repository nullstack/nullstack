import client from './client';
import router from './router';
import getQueryStringParams from '../shared/getQueryStringParams';

const paramsProxyHandler = {
  set(target, name, value) {
    const serializedValue = value && value.toJSON !== undefined ? value.toJSON() : value;
    console.log({serializedValue});
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
    client.params = target;
    target[name] = serializedValue;
    return true;
  },
  get(target, name) {
    return target[name] || '';
  }
}

export function generateParams(query) {
  const params = getQueryStringParams(query);
  return new Proxy(params, paramsProxyHandler);
}