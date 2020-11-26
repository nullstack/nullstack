import {updateParams} from './params';
import environment from './environment';
import extractLocation from '../shared/extractLocation';

let redirectTimer = null;

class Router {

  _changed = false

  _redirect(target) {
    const {url} = extractLocation(target);
    if(url != this.url) {
      if(environment.static) {
        window.location.href = url;
      } else {
        clearTimeout(redirectTimer);
        redirectTimer = setTimeout(() => {
          updateParams(url);
          history.pushState({}, document.title, url);
          window.dispatchEvent(new Event('popstate'));
          this._changed = true;
        }, 0);
      }
    }
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