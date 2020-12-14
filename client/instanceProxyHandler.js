import client from './client';
import deserialize from '../shared/deserialize';
import {generateContext} from './context';
import loading from './loading';
import worker from './worker';

const instanceProxyHandler = {
  get(target, name) {
    if(target[name] === undefined && target.constructor[name] === true) {
      return async (params) => {
        let payload;
        worker.fetching = true;
        loading[name] = true;
        const url = `/api/${target.constructor.hash}/${name}.json`;
        try {
          const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(params || {})
          });
          const text = await response.text();
          payload = deserialize(text).result;
          worker.responsive = true;
        } catch(e) {
          worker.responsive = false;
        }
        worker.fetching = false;
        delete loading[name];
        return payload;
      }
    } else if(typeof(target[name]) == 'function') {
      return (args) => {
        const context = generateContext({...target._context, ...args, self: target._self});
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  },
  set(target, name, value) {
    const result = Reflect.set(...arguments);
    if(!name.startsWith('_')) {
      client.update();
    }
    return result;
  }
}

export default instanceProxyHandler;