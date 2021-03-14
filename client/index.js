import deserialize from '../shared/deserialize';
import element from '../shared/element';
import router from './router';
import client from './client';
import context, { generateContext } from './context';
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
import fragment from '../shared/fragment';

import generateTree from '../shared/generateTree';
import { loadPlugins, usePlugins } from '../shared/plugins';

context.page = page;
context.router = router;
context.settings = settings;
context.worker = worker;
context.params = params;
context.project = project;
context.environment = window.environment;

client.memory = deserialize(JSON.stringify(window.instances));

const scope = client;
scope.generateContext = generateContext;
scope.context = context;

client.plugins = loadPlugins(scope);

export default class Nullstack {

  static element = element;
  static invoke = invoke;
  static fragment = fragment;
  static use = usePlugins('client');

  static async start(Starter) {
    window.addEventListener('popstate', () => {
      router._popState();
    });
    client.routes = {};
    updateParams(router.url);
    client.currentInstance = null;
    client.initializer = () => element(Starter);
    client.selector = document.querySelector('#application');
    client.virtualDom = await generateTree(client.initializer(), scope);
    context.environment = environment;
    scope.plugins = loadPlugins(scope);
    client.nextVirtualDom = await generateTree(client.initializer(), scope);
    rerender(client.selector);
    client.virtualDom = client.nextVirtualDom;
    client.nextVirtualDom = null;
    client.processLifecycleQueues();
    delete window.context;
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