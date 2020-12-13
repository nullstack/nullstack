const loadingProxyHandler = {
  get(target, name) {
    return false;
  }
}

const loading = new Proxy({}, loadingProxyHandler);

export default loading;