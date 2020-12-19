import client from './client';

const context = {};

for(const [key, value] of Object.entries(window.context)) {
  context[key] = value;
}

delete window.context;

const contextProxyHandler = {
  set(target, name, value) {
    context[name] = value;
    client.update();
    return Reflect.set(...arguments);
  },
  get(target, name) {
    return target[name] === undefined ? context[name] : target[name];
  }
}

export function generateContext(temporary) {
  return new Proxy(temporary, contextProxyHandler);
}

export default context;