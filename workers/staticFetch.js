async function asset(event) {
  const cache = await caches.open(self.context.environment.key);
  const cachedResponse = await cache.match(event.request);
  const networkResponsePromise = fetch(event.request);
  event.waitUntil(async function() {
    try {
      const networkResponse = await networkResponsePromise;
      await cache.put(event.request, networkResponse.clone());
    } catch(error) {
      console.log(error);
    }
  }());
  if(cachedResponse) return cachedResponse;
  try {
    return await networkResponsePromise;
  } catch(error) {
    return await cache.match('/');
  }
}

async function path(event) {
  const cache = await caches.open(self.context.environment.key);
  const api = event.request.url + '/index.json';
  try {
    const response = await fetch(event.request);
    const dataResponse = await extractData(response);
    await cache.put(api, dataResponse);
    return response;
  } catch(error) {
    const fallbackResponse = await cache.match(`/offline-${self.context.environment.key}/index.html`);  
    const cachedDataResponse = await cache.match(api);
    if(cachedDataResponse) {
      return await injectData(fallbackResponse, cachedDataResponse);
    } else {
      return fallbackResponse;
    }
  }
}

async function home(event) {
  const cache = await caches.open(self.context.environment.key);
  try {
    const networkResponse = await fetch('/');
    await cache.put('/', networkResponse.clone());
    return networkResponse;
  } catch(error) {
    return await cache.match('/');
  }
}

async function fingerprint(event) {
  const cache = await caches.open(self.context.environment.key);
  const cachedResponse = await cache.match(event.request);
  if(cachedResponse) return cachedResponse;
  const response = await fetch(event.request);
  await cache.put(event.request, response.clone());
  return response;
}

function ssg(event) {

  const url = new URL(event.request.url);

  if(url.origin !== location.origin) return;
  if(event.request.method !== 'GET') return;

  if(url.pathname.indexOf(self.context.environment.key) > -1) {
    return event.respondWith(fingerprint(event));
  }

  if(url.pathname.indexOf('.') > -1) {
    return event.respondWith(asset(event));
  }

  if(url.pathname === '/') {
    return event.respondWith(home(event));
  }

  event.respondWith(path(event));

}

self.addEventListener('fetch', ssg);