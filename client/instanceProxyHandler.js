import client from './client';
import {generateContext} from './context';

const instanceProxyHandler = {
  get(target, name) {
    if(typeof(target[name]) == 'function' && !target[name].name.startsWith('_')) {
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