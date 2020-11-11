import server from './server';
import project from './project';
import environment from './environment';

const context = {environment, server, project};

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