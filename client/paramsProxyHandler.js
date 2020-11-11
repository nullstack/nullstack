import client from './client';
import router from './router';

const paramsProxyHandler = {
  set(target, name, value) {
    const keys = Object.keys(target);
    if(!keys.includes(name)) {
      keys.push(name);
    }
    const search = keys.map((key) => {
      const delta = key == name ? value : target[key];
      if(delta === false || !!delta) {
        return `${key}=${delta}`;
      } else {
        return '';
      }
    }).filter((segment) => !!segment).join('&');
    router.url = window.location.pathname + (search ? '?' : '') + search;
    client.params = target;
    const result = Reflect.set(...arguments);
    return result;
  },
  get(target, name) {
    return target[name] || '';
  }
}

export default paramsProxyHandler;