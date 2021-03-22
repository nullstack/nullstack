import { generateObjectProxy } from './objectProxyHandler';
import client from './client';
import {generateContext} from './context';

const instanceProxyHandler = {
  get(target, name) {
    if(name === '_isProxy') return true;
    if(typeof(target[name]) == 'function' && !target[name].name.startsWith('_') && name !== 'constructor') {
      return (args) => {
        const context = generateContext({...target._attributes, ...args, self: target._self});
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  },
  set(target, name, value) {
    target[name] = generateObjectProxy(name, value);
    if(!name.startsWith('_')) {
      client.update();
    }
    return true;
  }
}

export default instanceProxyHandler;