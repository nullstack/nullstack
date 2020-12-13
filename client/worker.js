import environment from './environment';
import client from './client';
import router from './router';

const worker = {...window.worker};
worker.online = navigator.onLine;
delete window.worker;

const workerProxyHandler = {
  set(target, name, value) {
    if(target[name] !== value) {
      target[name] = value;
      client.update();
    }
    return true;
  }
}

const proxy = new Proxy(worker, workerProxyHandler);

if(worker.enabled) {

  window.addEventListener('beforeinstallprompt', function(event) {
    event.preventDefault();
    proxy.installation = event;
  });

  async function register() {
    if('serviceWorker' in navigator) {
      const request = `/service-worker-${environment.key}.js`;
      try {
        proxy.registration = await navigator.serviceWorker.register(request, {scope: '/'});
      } catch(error) {
        console.log(error);
      };
    }
  };

  register();

}

window.addEventListener('online', () => {
  proxy.online = true;
  if(environment.static) {
    router._update(router.url);
  } else {
    proxy.online = true;
  }
});

window.addEventListener('offline', () => {
  proxy.online = false;
});

export default proxy;