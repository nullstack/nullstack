import objectProxyHandler from './objectProxyHandler';
import isProxyable from './isProxyable';
import client from './client';
import {generateContext} from './context';

const instanceProxyHandler = {
  get(target, name) {
    if(typeof(target[name]) == 'function' && !target[name].name.startsWith('_') && name !== 'constructor') {
      return (args) => {
        const context = generateContext({...target._attributes, ...args, self: target._self});
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  },
  set(target, name, value) {
    if(isProxyable(name, value)) {
      value._isProxy = true;
      target[name] = new Proxy(value, objectProxyHandler);
    } else {
      target[name] = value;
    }
    if(!name.startsWith('_')) {
      client.update();
    }
    return true;
  }
}

export default instanceProxyHandler;