import client from './client';
import { generateObjectProxy } from './objectProxyHandler';
import state from './state';
import generateProps from '../shared/generateProps'

const context = {};

for (const key of Object.keys(state.context)) {
  context[key] = generateObjectProxy(key, state.context[key]);
}

const contextProxyHandler = {
  set(target, name, value) {
    context[name] = generateObjectProxy(name, value);
    client.update();
    return true;
  },
  get(target, name) {
    if (name === '_isProxy') return true;
    if (target[name] !== undefined) return target[name];
    return name === 'props' ? generateProps(context, target) : context[name]
  }
}

export function generateContext(temporary) {
  return new Proxy(temporary, contextProxyHandler);
}

export default context;