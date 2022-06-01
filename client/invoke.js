import deserialize from '../shared/deserialize';
import prefix from '../shared/prefix';
import page from './page';
import worker from './worker';

export default function invoke(name, hash) {
  return async function _invoke(params = {}) {
    let payload;
    worker.fetching = true;
    if (Object.isFrozen(worker.queues[name])) {
      worker.queues[name] = [params];
    } else {
      worker.queues[name] = [...worker.queues[name], params];
    }
    const finalHash = hash === this.hash ? hash : `${hash}-${this.hash}`;
    let url = `${worker.api}/${prefix}/${finalHash}/${name}.json`;
    let body = JSON.stringify(params || {});
    const options = {
      headers: worker.headers,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }
    if (/get[A-Z]([*]*)/.test(name)) {
      options.method = 'GET';
      url += `?payload=${encodeURIComponent(body)}`;
    } else {
      options.body = body;
      if (/patch[A-Z]([*]*)/.test(name)) {
        options.method = 'PATCH';
      } else if (/put[A-Z]([*]*)/.test(name)) {
        options.method = 'PUT';
      } else if (/delete[A-Z]([*]*)/.test(name)) {
        options.method = 'DELETE';
      } else {
        options.method = 'POST';
      }
    }
    try {
      const response = await fetch(url, options);
      page.status = response.status;
      if (module.hot && page.status === 500) {
        setInterval(() => {
          fetch(window.location.href).then((r) => r.status !== 500 && window.location.reload())
        }, 100)
      }
      const text = await response.text();
      payload = deserialize(text).result;
      worker.responsive = true;
    } catch (e) {
      worker.responsive = false;
    }
    if (worker.queues[name]?.length === 1) {
      delete worker.queues[name];
    } else {
      worker.queues[name] = worker.queues[name].filter((task) => task !== params);
    }
    worker.fetching = !!Object.keys(worker.queues).length;
    return payload;
  }
}