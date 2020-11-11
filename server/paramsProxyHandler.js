const paramsProxyHandler = {
  get(target, name) {
    return target[name] || '';
  }
}

export default paramsProxyHandler;