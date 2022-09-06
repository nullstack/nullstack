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
  Nullstack.serverHashes ??= {}
  Nullstack.serverPings = 0
  Nullstack.clientPings = 0
  const socket = new WebSocket('ws' + router.base.slice(4) + '/ws');
  socket.onmessage = async function (e) {
    const data = JSON.parse(e.data)
    if (data.type === 'NULLSTACK_SERVER_STARTED') {
      Nullstack.serverPings++
      if (Nullstack.needsReload || !environment.hot) {
        window.location.reload()
      }
    }
  };
  Nullstack.updateInstancesPrototypes = function updateInstancesPrototypes(klass, hash, serverHash) {
    for (const key in context.instances) {
      const instance = context.instances[key]
      if (instance.constructor.hash === hash) {
        Object.setPrototypeOf(instance, klass.prototype);
      }
    }
    if (Nullstack.serverHashes[hash]) {
      if (Nullstack.serverHashes[hash] !== serverHash) {
        if (Nullstack.clientPings < Nullstack.serverPings) {
          window.location.reload()
        } else {
          Nullstack.needsReload = true
        }
      }
      Nullstack.clientPings++
    }
    Nullstack.serverHashes[hash] = serverHash
    client.update()
  }
  Nullstack.hotReload = function hotReload(klass) {
    if (client.skipHotReplacement) {
      window.location.reload()
    } else {
      Nullstack.start(klass);
      windowEvent('environment');
    }
  }
  module.hot.decline()
}