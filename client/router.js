import {updateParams} from './params';
import environment from './environment';
import extractLocation from '../shared/extractLocation';
import worker from './worker';
import page from './page';
import windowEvent from './windowEvent';
import client from './client';

let redirectTimer = null;

class Router {

  _changed = false

  async _update(url, push) {
    clearTimeout(redirectTimer);
    redirectTimer = setTimeout(async () => {
      if(environment.static) {
        worker.fetching = true;
        const api = '/index.json';
        const endpoint = url === '/' ? api : url+api;
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
        history.pushState({}, document.title, url);
      }
      updateParams(url);
      client.update();
      windowEvent('router.url');
      this._changed = true;
    }, 0);
  }

  async _redirect(target) {
    const {url} = extractLocation(target);
    if(url != this.url) {
      await this._update(url, true);
    }
    window.scroll(0, 0);
  }

  get url() {
    return extractLocation(window.location.pathname+window.location.search).url;
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return extractLocation(window.location.pathname).path;
  }

  set path(target) {
    this._redirect(target+window.location.search);
  }

}

const router = new Router();

export default router;