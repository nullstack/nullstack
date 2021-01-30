import client from './client';
import isProxyable from './isProxyable';

const objectProxyHandler = {
  set(target, name, value) {
    if(isProxyable(value)) {
      value._isProxy = true;
      target[name] = new Proxy(value, this);
    } else {
      target[name] = value;
    }
    if(!name.startsWith('_')) {
      client.update();
    }
    return true;
  }
}

export default objectProxyHandler;