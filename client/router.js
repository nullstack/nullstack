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
    this._url = extractLocation(window.location.pathname+window.location.search).url;
  }

  async _popState() {
    const {url} = extractLocation(window.location.pathname+window.location.search);
    console.log(url);
    await this._update(url, false);
  }

  async _update(target, push) {
    const {url} = extractLocation(target);
    console.log('a',  url);
    clearTimeout(redirectTimer);
    redirectTimer = setTimeout(async () => {
      page.status = 200;
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
      this._url = url;
      this._changed = true;
      updateParams(url);
      client.update();
      windowEvent('router');
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