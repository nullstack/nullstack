import environment from './environment';
import client from './client';
import router from './router';

const worker = {...window.worker};
delete window.worker;

if(worker.enabled) {

  window.addEventListener('beforeinstallprompt', function(event) {
    event.preventDefault();
    worker.installation = event;
  });

  async function register() {
    if('serviceWorker' in navigator) {
      const request = `/service-worker-${environment.key}.js`;
      try {
        worker.registration = await navigator.serviceWorker.register(request, {scope: '/'});
      } catch(error) {
        console.log(error);
      };
    }
  }

  register();

}

const workerProxyHandler = {
  set(target, name, value) {
    if(name === 'fetching' || name === 'online') {
      if(target[name] !== value) {
        target[name] = value;
        client.update();
      }
    } else {
      target[name] = value;
    }
    return true;
  }
}

const proxy = new Proxy(worker, workerProxyHandler);

window.addEventListener('online', () => {
  if(environment.static) {
    router._update(router.url);
  } else {
    proxy.online = true;
  }
});

export default proxy;