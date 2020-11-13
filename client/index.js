import deserialize from '../shared/deserialize';
import element from '../shared/element';
import router from './router';
import client from './client';
import context from './context';
import rerender from './rerender';
import instanceProxyHandler from './instanceProxyHandler';
import page from './page';
import environment from './environment';
import {generateParams} from './params';
import network from './network';

context.environment = environment;
context.page = page;
context.router = router;
context.network = network;

export default class Nullstack {

  static element = element;

  static start(Starter) {
    window.representation = deserialize(JSON.stringify(window.representation));
    window.instances = deserialize(JSON.stringify(window.instances));
    window.addEventListener('popstate', () => {
      client.update();
    });
    for(const [key, value] of Object.entries(window.context)) {
      context[key] = value;
    }
    Object.freeze(context.project);
    delete window.context;
    client.routes = {};
    const [path, query] = router.url.split('?');
    context.params = generateParams(query);
    client.currentInstance = null;
    client.initializer = () => element(Starter);
    client.selector = document.querySelector('#application');
    client.instancesMountedQueue = [];
    client.instancesRenewedQueue = [];
    client.virtualDom = window.representation;
    client.nextVirtualDom = client.initializer();
    rerender(client.selector, [0], []);
    client.virtualDom = client.nextVirtualDom;
    client.nextVirtualDom = null;
    delete window.representation;
    delete window.instances;
    client.processLifecycleQueues();
  }

  constructor() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const proxy = new Proxy(this, instanceProxyHandler);
    for(const method of methods) {
      if(method !== 'constructor' && typeof(this[method]) === 'function') {
        this[method] = this[method].bind(proxy);
      }
    }
    return proxy;
  }

  render() {
    return false;
  }

}