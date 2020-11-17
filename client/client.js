import router from './router';
import rerender from './rerender';

const client = {};

client.initialized = false;
client.hydrated = false;
client.initializer = null;

client.instances = {};
client.instancesMountedQueue = [];
client.instancesRenewedQueue = [];
client.instancesHydratedQueue = [];
client.virtualDom = {};
client.selector = null;
client.routes = {};

client.renderQueue = null;

client.update = function() {
  if(client.initialized) {
    clearInterval(client.renderQueue);
    client.renderQueue = setTimeout(() => {
      client.initialized = false;
      client.routes = {};
      client.instancesMountedQueue = [];
      client.instancesRenewedQueue = [];
      client.instancesHydratedQueue = [];
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
  for(const instance of client.instancesMountedQueue) {
    instance.initiate && await instance.initiate();
    if(router.processing) {
      setTimeout(() => {
        router.processing = false;
        client.update();
      }, 0);
    }
  }
  for(const instance of client.instancesHydratedQueue) {
    instance.update && await instance.update();
  }
  for(const key in client.instances) {
    const instance = client.instances[key];
    if(!client.instancesRenewedQueue.includes(instance)) {
      instance.terminate && await instance.terminate();
      delete client.instances[key];
    }
  }
  router._changed = false;
}

export default client;