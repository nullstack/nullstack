import 'dotenv/config';
import context from './context';
import server from './server';
import registry from './registry';
import generator from './generator';
import element from '../shared/element';
import project from './project';
import environment from './environment';
import settings, { loadSettings } from './settings';
import secrets, { loadSecrets } from './secrets';
import { freezeConfigurable } from './configurable';
import worker from './worker';
import invoke from './invoke';
import instanceProxyHandler from './instanceProxyHandler';
import getProxyableMethods from '../shared/getProxyableMethods';
import fragment from '../shared/fragment';
import { usePlugins } from '../shared/plugins';
import { normalize } from 'path';

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
  static invoke = invoke;
  static fragment = fragment;
  static use = usePlugins('server');

  static start(Starter, ...starters) {
    if (this.name.indexOf('Nullstack') > -1) {
      if (server.less) {
        server.start();
      }
      server.ready = (async function () {
        generator.starter = () => element(Starter);
        loadSettings();
        loadSecrets();
        typeof (Starter.start) === 'function' && await Starter.start(context);
        for (const starter of starters) {
          starter.start(context)
        }
        freezeConfigurable(settings);
        freezeConfigurable(secrets);
        Object.freeze(worker);
        Object.freeze(project);
        if (!server.less) {
          server.start();
        }
      })()
      context.start = async function () {
        await server.ready;
        return context;
      }
      return context;
    }
  }

  _self = {
    prerendered: true,
    initiated: false,
    hydrated: false
  }

  constructor(scope) {
    this._request = () => scope.request;
    this._response = () => scope.response;
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
      if (typeof (this[name]) !== 'function' && !name.startsWith('_') && name !== 'attributes') {
        serialized[name] = this[name];
      }
    }
    return serialized;
  }

  render() {
    return false;
  }

}

export default Nullstack;