import state from './state'
import element from '../shared/element';
import fragment from '../shared/fragment';
import generateTree from '../shared/generateTree';
import getProxyableMethods from '../shared/getProxyableMethods';
import { loadPlugins, usePlugins } from '../shared/plugins';
import client from './client';
import context, { generateContext } from './context';
import environment from './environment';
import instanceProxyHandler from './instanceProxyHandler';
import invoke from './invoke';
import './liveReload';
import page from './page';
import params, { updateParams } from './params';
import project from './project';
import render from './render';
import rerender from './rerender';
import hydrate from './hydrate';
import router from './router';
import settings from './settings';
import worker from './worker';

context.page = page;
context.router = router;
context.settings = settings;
context.worker = worker;
context.params = params;
context.project = project;
context.environment = state.environment;

client.memory = state.instances;

const scope = client;
scope.generateContext = generateContext;
scope.context = context;

client.plugins = loadPlugins(scope);

export default class Nullstack {

  static element = element;
  static invoke = invoke;
  static fragment = fragment;
  static use = usePlugins('client');

  static start(Starter) {
    setTimeout(async () => {
      window.addEventListener('popstate', () => {
        router._popState();
      });
      client.routes = {};
      updateParams(router.url);
      client.currentInstance = null;
      client.initializer = () => element(Starter);
      client.selector = document.getElementById('application');
      if (environment.mode === 'spa') {
        scope.plugins = loadPlugins(scope);
        worker.online = navigator.onLine;
        typeof context.start === 'function' && await context.start(context);
        context.environment = environment;
        client.virtualDom = await generateTree(client.initializer(), scope);
        const body = render(client.virtualDom);
        client.selector.replaceWith(body);
        client.selector = body
      } else {
        client.virtualDom = await generateTree(client.initializer(), scope);
        hydrate(client.selector, client.virtualDom)
        context.environment = environment;
        scope.plugins = loadPlugins(scope);
        worker.online = navigator.onLine;
        typeof context.start === 'function' && await context.start(context);
        client.nextVirtualDom = await generateTree(client.initializer(), scope);
        rerender();
        client.virtualDom = client.nextVirtualDom;
        client.nextVirtualDom = null;
      }
      client.processLifecycleQueues();
      delete state.context;
    }, 0)
    return generateContext({});
  }

  _self = {
    prerendered: false,
    initiated: false,
    hydrated: false,
    terminated: false,
    element: null,
  }

  constructor() {
    const methods = getProxyableMethods(this);
    const proxy = new Proxy(this, instanceProxyHandler);
    for (const method of methods) {
      this[method] = this[method].bind(proxy);
    }
    return proxy;
  }

  render() {
    return false;
  }

}