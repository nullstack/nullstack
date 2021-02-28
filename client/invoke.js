import deserialize from '../shared/deserialize';
import worker from './worker';
import prefix from '../shared/prefix';
import page from './page';

export default function invoke(name, hash) {
  return async function _invoke(params = {}) {
    let payload;
    worker.fetching = true;
    if(worker.loading[name] !== undefined) {
      worker.loading[name] = [...worker.loading[name], params];
    } else {
      worker.loading[name] = [params];
    }
    const finalHash = hash === this.constructor.hash ? hash : `${hash}-${this.constructor.hash}`;
    let url = `/${prefix}/${finalHash}/${name}.json`;
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
    if(worker.loading[name]?.length === 1) {
      delete worker.loading[name];
    } else {
      worker.loading[name] = worker.loading[name].filter((task) => task !== params);
    }
    worker.fetching = !!Object.keys(worker.loading).length;
    return payload;
  }
}