import client from './client';
import deserialize from '../shared/deserialize';
import {generateContext} from './context';

const instanceProxyHandler = {
  get(target, name) {
    if(target._attributes && target._attributes.proxy && target._attributes.proxy[name] !== undefined && target[name] !== undefined) {
      return target._attributes.proxy[name];
    }
    if(name !== 'prepare' && name !== 'initiate' && target[name] === undefined && target.constructor[name] === true) {
      const detour = async function(params = {}) {
        const url = `/${target.constructor.hash}/${name}.json`;
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(params)
        });
        const payload = await response.text();
        return deserialize(payload).result;
      }
      target[name] = detour.bind(this);
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
    client.update();
    return result;
  }
}

export default instanceProxyHandler;