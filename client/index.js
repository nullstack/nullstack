import state from './state'
import element from '../shared/element';
import fragment from '../shared/fragment';
import generateTree from '../shared/generateTree';
import { loadPlugins, useClientPlugins } from '../shared/plugins';
import client from './client';
import context, { generateContext } from './context';
import environment from './environment';
import instanceProxyHandler, { instanceProxies } from './instanceProxyHandler';
import invoke from './invoke';
import page from './page';
import params, { updateParams } from './params';
import project from './project';
import render from './render';
import rerender from './rerender';
import hydrate from './hydrate';
import router from './router';
import settings from './settings';
import worker from './worker';
import klassMap from './klassMap';
import windowEvent from './windowEvent'

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
  static use = useClientPlugins;
  static klassMap = {}
  static context = generateContext({})

  static start(Starter) {
    setTimeout(async () => {
      window.addEventListener('popstate', () => {
        router._popState();
      });
      if (client.initializer) {
        client.initializer = () => element(Starter);
        client.update()
        return this.context
      }
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
        client.currentBody = client.nextBody
        client.currentHead = client.nextHead
        client.nextBody = {}
        client.nextHead = []
        context.environment = environment;
        scope.plugins = loadPlugins(scope);
        worker.online = navigator.onLine;
        typeof context.start === 'function' && await context.start(context);
        client.nextVirtualDom = await generateTree(client.initializer(), scope);
        rerender();
      }
      client.processLifecycleQueues();
      delete state.context;
    }, 0)
    return this.context;
  }

  prerendered = false
  initiated = false
  hydrated = false
  terminated = false
  key = null

  constructor() {
    const proxy = new Proxy(this, instanceProxyHandler);
    instanceProxies.set(this, proxy)
    return proxy;
  }

  render() {
    return false;
  }

}

if (module.hot) {
  const socket = new WebSocket('ws' + window.location.origin.slice(4) + '/ws');
  window.lastHash
  socket.onmessage = async function (e) {
    const data = JSON.parse(e.data)
    if (data.type === 'NULLSTACK_SERVER_STARTED') {
      (window.needsReload || !environment.hot) && window.location.reload()
    } else if (data.type === 'hash') {
      const newHash = data.data.slice(20)
      if (newHash === window.lastHash) {
        window.needsReload = true
      } else {
        window.lastHash = newHash
      }
    }
  };
  Nullstack.updateInstancesPrototypes = function updateInstancesPrototypes(hash, klass) {
    for (const key in context.instances) {
      const instance = context.instances[key]
      if (instance.constructor.hash === hash) {
        Object.setPrototypeOf(instance, klass.prototype);
      }
    }
    klassMap[hash] = klass
  }
  Nullstack.hotReload = function hotReload(klass) {
    if (client.skipHotReplacement) {
      setInterval(() => {
        fetch(window.location.href).then((r) => r.status !== 500 && window.location.reload())
      }, 100)
    } else {
      Nullstack.start(klass);
      windowEvent('environment');
    }
  }
  module.hot.decline()
}