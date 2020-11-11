const context = {};

const contextProxyHandler = {
  set(target, name, value) {
    context[name] = value;
    return Reflect.set(...arguments);
  }
}

export function generateContext(temporary) {
  return new Proxy({...context, ...temporary}, contextProxyHandler);
}

export default context;