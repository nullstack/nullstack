import client from './client';
import deserialize from '../shared/deserialize';
import {generateObjectProxy} from './objectProxyHandler';

const context = {};

const memory = deserialize(JSON.stringify(window.context));
for(const key of Object.keys(memory)) {
  context[key] = generateObjectProxy(key, memory[key]);
}

const contextProxyHandler = {
  set(target, name, value) {
    context[name] = generateObjectProxy(name, value);
    client.update();
    return true;
  },
  get(target, name) {
    if(name === '_isProxy') return true;
    return target[name] === undefined ? context[name] : target[name];
  }
}

export function generateContext(temporary) {
  return new Proxy(temporary, contextProxyHandler);
}

export default context;