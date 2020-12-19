export function generateContext(context) {
  const contextProxyHandler = {
    set(target, name, value) {
      context[name] = value;
      return Reflect.set(...arguments);
    }
  }  
  return function(temporary) {
    return new Proxy({...context, ...temporary}, contextProxyHandler);
  }
}