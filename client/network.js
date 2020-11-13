import client from './client';

const networkProxyHandler = {
  set(target, name, value) {
    target[name] = value;
    client.update();
    return true;
  },
  get(target, name) {
    return target[name] || false;
  }
}

const network = new Proxy({}, networkProxyHandler);

export default network;