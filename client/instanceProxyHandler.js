import client from './client';
import deserialize from '../shared/deserialize';
import {generateContext} from './context';
import network from './network';

const instanceProxyHandler = {
  get(target, name) {
    if(target._attributes && target._attributes.proxy && target._attributes.proxy[name] !== undefined && target[name] !== undefined) {
      return target._attributes.proxy[name];
    }
    if(target[name] === undefined && target.constructor[name] === true) {
      return async (params) => {
        network.processing = true;
        network[name] = true;
        const url = `/api/${target.constructor.hash}/${name}.json`;
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(params || {})
        });
        const payload = await response.text();
        network.processing = false;
        delete network[name];
        return deserialize(payload).result;
      }
    } else if(typeof(target[name]) == 'function') {
      return (args) => {
        const context = generateContext({...target._context, ...args});
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  },
  set(target, name, value) {
    if(target._attributes && target._attributes.proxy && target._attributes.proxy[name] !== undefined && target[name] !== undefined) {
      target._attributes.proxy[name] = value;
    }
    const result = Reflect.set(...arguments);
    if(!name.startsWith('_')) {
      client.update();
    }
    return result;
  }
}

export default instanceProxyHandler;