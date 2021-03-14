import segments from './segments';
import router from './router';
import rerender from './rerender';
import context, { generateContext } from './context';

import generateTree from '../shared/generateTree';
import { loadPlugins } from '../shared/plugins';

const client = {};

client.initialized = false;
client.hydrated = false;
client.initializer = null;

client.instances = {};
context.instances = client.instances;
client.initiationQueue = [];
client.renewalQueue = [];
client.hydrationQueue = [];
client.virtualDom = {};
client.selector = null;
client.routes = {};
client.events = {};
client.generateContext = generateContext;

client.renderQueue = null;

client.update = async function() {
  if(client.initialized) {
    clearInterval(client.renderQueue);
    client.renderQueue = setTimeout(async () => {
      const scope = client;
      scope.context = context;
      scope.plugins = loadPlugins(scope);
      client.initialized = false;
      client.initiationQueue = [];
      client.renewalQueue = [];
      client.hydrationQueue = [];
      client.nextVirtualDom = await generateTree(client.initializer(), scope);
      rerender(client.selector);
      client.virtualDom = client.nextVirtualDom;
      client.nextVirtualDom = null;
      client.processLifecycleQueues();
    }, 16);
  }
}

client.processLifecycleQueues = async function() {
  if(!client.initialized) {
    client.initialized = true;
    client.hydrated = true;
  }
  const initiationQueue = client.initiationQueue;
  const hydrationQueue = client.hydrationQueue;
  for(const instance of initiationQueue) {
    instance.initiate && await instance.initiate();
    instance._self.initiated = true;
  }
  if(initiationQueue.length) {
    client.update();
  }
  for(const instance of hydrationQueue) {
    instance.hydrate && await instance.hydrate();
    instance._self.hydrated = true;
  }
  if(hydrationQueue.length) {
    client.update();
  }
  for(const key in client.instances) {
    const instance = client.instances[key];
    if(!client.renewalQueue.includes(instance)) {
      instance.terminate && await instance.terminate();
      delete client.instances[key];
    }
  }
  router._changed = false;
}

export default client;