import router from './router';
import {generateParams} from './params';
import {generateContext} from './context';
import rerender from './rerender';

const client = {};

client.initialized = false;
client.hydrated = false;
client.initializer = null;

client.instances = {};
client.instancesMountedQueue = [];
client.instancesRenewedQueue = [];
client.virtualDom = {};
client.selector = null;
client.routes = {};
client.params = {};

client.renderQueue = null;

client.update = function() {
  if(client.initialized) {
    clearInterval(client.renderQueue);
    client.renderQueue = setTimeout(() => {
      const [path, query] = router.url.split('?');
      client.params = generateParams(query);
      client.initialized = false;
      client.routes = {};
      client.instancesMountedQueue = [];
      client.instancesRenewedQueue = [];
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
    const context = generateContext(instance._attributes);
    instance.initiate && await instance.initiate(context);
  }
  for(const [id, instance] of Object.entries(client.instances)) {
    if(!client.instancesRenewedQueue.includes(instance)) {
      const context = generateContext(instance._attributes);
      instance.terminate && await instance.terminate(context);
      delete client.instances[id];
    }
  }
  router._changed = false;
}

export default client;