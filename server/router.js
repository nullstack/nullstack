import removeTrailingSlash from '../shared/removeTrailingSlash';

export default class Router {

  constructor(scope) {
    this.scope = scope;
  }

  _redirect(target) {
    target = removeTrailingSlash(target);
    if(!this.scope.response.headersSent) {
      this.scope.response.redirect(target);
    }
  }

  get url() {
    return removeTrailingSlash(this.scope.request.originalUrl);
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return removeTrailingSlash(this.scope.request.path);
  }

  set path(target) {
    const search = this.scope.request.originalUrl.split('?')[1];
    if(search) {
      this._redirect(target+'?'+search);
    } else {
      this._redirect(target);
    }
  }

  toJSON() {
    return {
      url: this.url,
      path: this.path
    }
  }

}