import client from 'nullstack/client/client';

const loadingProxyHandler = {
  set(target, name, value) {
    target[name] = value;
    client.update();
    return true;
  },
  get(target, name) {
    return target[name] || false;
  }
}

const loading = new Proxy({}, loadingProxyHandler);

export default loading;