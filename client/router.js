import {updateParams} from './params';
import environment from './environment';
import removeTrailingSlash from '../shared/removeTrailingSlash';

let redirectTimer = null;

class Router {

  _changed = false

  _redirect(target) {
    target = removeTrailingSlash(target);
    if(target != this.url) {
      if(environment.static) {
        window.location.href = target;
      } else {
        clearTimeout(redirectTimer);
        redirectTimer = setTimeout(() => {
          updateParams(target);
          history.pushState({}, document.title, target);
          window.dispatchEvent(new Event('popstate'));
          this._changed = true;
        }, 0);
      }
    }
  }

  get url() {
    return removeTrailingSlash(window.location.pathname+window.location.search);
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return removeTrailingSlash(window.location.pathname);
  }

  set path(target) {
    this._redirect(target+window.location.search);
  }

}

const router = new Router();

export default router;