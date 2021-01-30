import deserialize from '../shared/deserialize';
import element from '../shared/element';
import router from './router';
import client from './client';
import context from './context';
import rerender from './rerender';
import instanceProxyHandler from './instanceProxyHandler';
import page from './page';
import environment from './environment';
import params, {updateParams} from './params';
import settings from './settings';
import worker from './worker';
import project from './project';
import invoke from './invoke';
import getProxyableMethods from '../shared/getProxyableMethods';

context.page = page;
context.router = router;
context.settings = settings;
context.worker = worker;
context.params = params;
context.project = project;

export default class Nullstack {

  static element = element;
  static invoke = invoke;

  static start(Starter) {
    window.instances = deserialize(JSON.stringify(window.instances));
    window.addEventListener('popstate', () => {
      router._popState();
    });
    client.routes = {};
    updateParams(router.url);
    client.currentInstance = null;
    client.initializer = () => element(Starter);
    client.selector = document.querySelector('#application');
    client.virtualDom = client.initializer();
    context.environment = environment;
    client.nextVirtualDom = client.initializer();
    rerender(client.selector, [0], []);
    client.virtualDom = client.nextVirtualDom;
    client.nextVirtualDom = null;
    client.processLifecycleQueues();
  }

  _self = {
    prerendered: false,
    initiated: false,
    hydrated: false
  }

  constructor() {
    const methods = getProxyableMethods(this);
    const proxy = new Proxy(this, instanceProxyHandler);
    for(const method of methods) {
      this[method] = this[method].bind(proxy);
    }
    return proxy;
  }

  render() {
    return false;
  }

}