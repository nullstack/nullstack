import './dotenv';
import { normalize } from 'path';
import element from '../shared/element';
import fragment from '../shared/fragment';
import getProxyableMethods from '../shared/getProxyableMethods';
import { useServerPlugins } from '../shared/plugins';
import context from './context';
import environment from './environment';
import generator from './generator';
import instanceProxyHandler from './instanceProxyHandler';
import project from './project';
import registry from './registry';
import secrets from './secrets';
import server from './server';
import settings from './settings';
import worker from './worker';
import reqres from './reqres'
import { generateContext } from './context';

globalThis.window = {}

context.server = server;
context.project = project;
context.environment = environment;
context.settings = settings;
context.secrets = secrets;
context.worker = worker;

server.less = normalize(__filename) !== normalize(process.argv[1])

class Nullstack {

  static registry = registry;
  static element = element;
  static fragment = fragment;
  static use = useServerPlugins;

  static bindStaticFunctions(klass) {
    let parent = klass
    while (parent.name !== 'Nullstack') {
      const props = Object.getOwnPropertyNames(parent)
      for (const prop of props) {
        const underscored = prop.startsWith('_')
        if (typeof klass[prop] === 'function') {
          if (!underscored && !registry[`${parent.hash}.${prop}`]) {
            return
          }
          const propName = `__NULLSTACK_${prop}`
          if (!klass[propName]) {
            klass[propName] = klass[prop]
          }
          function _invoke(...args) {
            if (underscored) {
              return klass[propName].call(klass, ...args);
            }
            const params = args[0] || {}
            const { request, response } = reqres
            const context = generateContext({ request, response, ...params });
            return klass[propName].call(klass, context);
          }
          klass[prop] = _invoke
          klass.prototype[prop] = _invoke
        }
      }
      parent = Object.getPrototypeOf(parent)
    }
  }

  static start(Starter) {
    if (this.name.indexOf('Nullstack') > -1) {
      generator.starter = () => element(Starter);
      setTimeout(server.start, 0)
      return context;
    }
  }

  prerendered = true
  initiated = false
  hydrated = false
  terminated = false
  key = null

  constructor() {
    const methods = getProxyableMethods(this);
    const proxy = new Proxy(this, instanceProxyHandler);
    for (const method of methods) {
      this[method] = this[method].bind(proxy);
    }
    return proxy;
  }

  toJSON() {
    const serialized = {};
    for (const name of Object.getOwnPropertyNames(this)) {
      if (name === 'prerendered') continue
      if (name === 'initiated') continue
      if (name === 'hydrated') continue
      if (name === 'terminated') continue
      if (name === 'key') continue
      if (name === '_attributes') continue
      if (name === '_scope') continue
      if (typeof this[name] === 'function') continue
      serialized[name] = this[name];
    }
    return serialized;
  }

  render() {
    return false;
  }

}

export default Nullstack;