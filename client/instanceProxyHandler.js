import { generateObjectProxy } from './objectProxyHandler';
import client from './client';
import { generateContext } from './context';

const instanceProxyHandler = {
  get(target, name) {
   if(name === '_isProxy') return true;
   if (!name.startsWith('_') && typeof (target[name]) == 'function' && name !== 'constructor') {
      const {[name]: func} = {
        [name]: (args) => {
        const context = generateContext({...target._attributes, ...args, self: target._self});
        return target[name](context);
        }
      }
      return func;
    }
    return Reflect.get(...arguments);
  },
  set(target, name, value) {
    if (!name.startsWith('_')) {
      target[name] = generateObjectProxy(name, value);
      client.update();
    } else {
      target[name] = value
    }
    return true;
  }
}

export default instanceProxyHandler;