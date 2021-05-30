import deserialize from '../shared/deserialize';
import worker from './worker';
import prefix from '../shared/prefix';
import page from './page';

export default function invoke(name, hash) {
  return async function _invoke(params = {}) {
    let payload;
    worker.fetching = true;
    if(Object.isFrozen(worker.queues[name])) {
      worker.queues[name] = [params];
    } else {
      worker.queues[name] = [...worker.queues[name], params];
    }
    const finalHash = hash === this.constructor.hash ? hash : `${hash}-${this.constructor.hash}`;
    let url = `${worker.api}/${prefix}/${finalHash}/${name}.json`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: worker.headers,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(params || {})
      });
      page.status = response.status;
      const text = await response.text();
      payload = deserialize(text).result;
      worker.responsive = true;
    } catch(e) {
      worker.responsive = false;
    }
    if(worker.queues[name]?.length === 1) {
      delete worker.queues[name];
    } else {
      worker.queues[name] = worker.queues[name].filter((task) => task !== params);
    }
    worker.fetching = !!Object.keys(worker.queues).length;
    return payload;
  }
}