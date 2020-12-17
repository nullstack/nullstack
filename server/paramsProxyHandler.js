const paramsProxyHandler = {
  get(target, name) {
    if(target[name] === false) return false;
    return target[name] || '';
  }
}

export default paramsProxyHandler;