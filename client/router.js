import extractLocation from '../shared/extractLocation';
import client from './client';
import environment from './environment';
import page from './page';
import { updateParams } from './params';
import segments from './segments';
import windowEvent from './windowEvent';
import worker from './worker';

let redirectTimer = null;

class Router {

  event = 'nullstack.router';
  previous = null;
  _changed = false;
  _segments = segments;

  constructor() {
    const { hash, url } = extractLocation(window.location.pathname + window.location.search);
    this._url = url;
    this._hash = hash;
  }

  async _popState() {
    const { urlWithHash } = extractLocation(window.location.pathname + window.location.search);
    await this._update(urlWithHash, false);
  }

  async _update(target, push) {
    const { url, path, hash, urlWithHash } = extractLocation(target);
    if (url === this._url && this._hash === hash) return
    this.previous = this.url;
    clearTimeout(redirectTimer);
    redirectTimer = setTimeout(async () => {
      page.status = 200;
      if (environment.mode === 'ssg') {
        worker.fetching = true;
        const api = '/index.json';
        const endpoint = path === '/' ? api : path + api;
        try {
          const response = await fetch(endpoint);
          const payload = await response.json(url);
          client.memory = payload.instances;
          for (const key in payload.page) {
            page[key] = payload.page[key];
          }
          worker.responsive = true;
        } catch (error) {
          worker.responsive = false;
        }
        worker.fetching = false;
      }
      if (push) {
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
    if (/^(\w+:|\/\/)([^.]+.)/.test(target)) {
      return window.location.href = target;
    }
    const absoluteUrl = new URL(target, document.baseURI);
    await this._update(absoluteUrl.pathname + absoluteUrl.search + absoluteUrl.hash, true);
    window.scroll(0, 0)
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
    this._redirect(target + window.location.search);
  }

  get base() {
    if (this._base) return this._base
    this._base = new URL(document.querySelector('[rel="canonical"]').href).origin
    return this._base
  }

}

const router = new Router();

export default router;