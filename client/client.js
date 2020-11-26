import router from './router';
import rerender from './rerender';

const client = {};

client.initialized = false;
client.hydrated = false;
client.initializer = null;

client.instances = {};
client.initiationQueue = [];
client.renewalQueue = [];
client.hydrationQueue = [];
client.virtualDom = {};
client.selector = null;
client.routes = {};
client.events = {};

client.renderQueue = null;

client.update = function() {
  if(client.initialized) {
    clearInterval(client.renderQueue);
    client.renderQueue = setTimeout(() => {
      client.initialized = false;
      client.routes = {};
      client.initiationQueue = [];
      client.renewalQueue = [];
      client.hydrationQueue = [];
      client.nextVirtualDom = client.initializer();
      rerender(client.selector, [0], []);
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