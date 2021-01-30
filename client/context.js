import client from './client';
import deserialize from '../shared/deserialize';
import objectProxyHandler from './objectProxyHandler';
import isProxyable from './isProxyable';

const context = deserialize(JSON.stringify(window.context));
delete window.context;

const contextProxyHandler = {
  set(target, name, value) {
    if(isProxyable(value)) {
      value._isProxy = true;
      context[name] = new Proxy(value, objectProxyHandler);
    } else {
      context[name] = value;
    }
    client.update();
    return Reflect.set(...arguments);
  },
  get(target, name) {
    return target[name] === undefined ? context[name] : target[name];
  }
}

export function generateContext(temporary) {
  return new Proxy(temporary, contextProxyHandler);
}

export default context;