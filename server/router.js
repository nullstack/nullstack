export default class Router {

  constructor(scope) {
    this.scope = scope;
  }

  _redirect(target) {
    if(!this.scope.response.headersSent) {
      this.scope.response.redirect(target);
    }
  }

  get url() {
    return this.scope.request.originalUrl;
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return this.scope.request.path;
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
      url: this.scope.request.originalUrl,
      path: this.scope.request.path
    }
  }

}