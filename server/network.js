const networkProxyHandler = {
  get(target, name) {
    return false;
  }
}

const network = new Proxy({}, networkProxyHandler);


export default network;