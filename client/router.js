import {updateParams} from './params';
import environment from './environment';
import extractLocation from '../shared/extractLocation';
import worker from './worker';
import page from './page';
import windowEvent from './windowEvent';
import client from './client';

let redirectTimer = null;

class Router {

  event = 'nullstack.router';

  _changed = false

  constructor() {
    const {hash, url} = extractLocation(window.location.pathname+window.location.search);
    this._url = url;
    this._hash = hash;
  }

  async _popState() {
    const {urlWithHash} = extractLocation(window.location.pathname+window.location.search);
    await this._update(urlWithHash, false);
  }

  async _update(target, push) {
    const {url, path, hash, urlWithHash} = extractLocation(target);
    clearTimeout(redirectTimer);
    redirectTimer = setTimeout(async () => {
      page.status = 200;
      if(environment.static) {
        worker.fetching = true;
        const api = '/index.json';
        const endpoint = path === '/' ? api : path+api;
        try {
          const response = await fetch(endpoint);
          const payload = await response.json(url);
          window.instances = payload.instances;
          for(const key in payload.page) {
            page[key] = payload.page[key];
          }
          worker.responsive = true;
        } catch(error) {
          worker.responsive = false;
        }
        worker.fetching = false;
      }
      if(push) {
        history.pushState({}, document.title, urlWithHash);
      }
      this._url = url;
      this._hash = hash;
      this._changed = true;
      updateParams(url);
      client.update();
      windowEvent('router');
    }, 0);
  }

  async _redirect(target) {
    const {url, hash, urlWithHash} = extractLocation(target);
    if(url !== this._url || this._hash !== hash) {
      await this._update(urlWithHash, true);
    }
    if(!hash) {
      window.scroll(0, 0);
    }
  }

  get url() {
    return this._url;
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return extractLocation(this._url).path;
  }

  set path(target) {
    this._redirect(target+window.location.search);
  }

}

const router = new Router();

export default router;