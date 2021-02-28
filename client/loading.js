import client from './client';

const loadingProxyHandler = {
  set(target, name, value) {
    target[name] = value;
    client.update();
    return true;
  }
}

const loading = new Proxy({}, loadingProxyHandler);

export default loading;