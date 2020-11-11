import client from './client';
import paramsProxyHandler from './paramsProxyHandler';

const context = {};

const contextProxyHandler = {
  set(target, name, value) {
    context[name] = value;
    client.update();
    return Reflect.set(...arguments);
  }
}

export function generateContext(temporary) {
  const params = temporary.params ? {...temporary.params, ...client.params} : client.params;
  temporary.params = new Proxy(params, paramsProxyHandler);
  return new Proxy({...context, ...temporary}, contextProxyHandler);
}

export default context;