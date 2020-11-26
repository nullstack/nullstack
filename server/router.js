import extractLocation from '../shared/extractLocation';

export default class Router {

  constructor(scope) {
    this.scope = scope;
  }

  _redirect(target) {
    if(!this.scope.response.headersSent) {
      const {url} = extractLocation(target);
      this.scope.response.redirect(url);
    }
  }

  get url() {
    return extractLocation(this.scope.request.originalUrl).url;
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return extractLocation(this.scope.request.path).path;
  }

  set path(target) {
    console.log({target});
    const {search} = extractLocation(this.scope.request.originalUrl);
    if(search) {
      this._redirect(target+'?'+search);
    } else {
      this._redirect(target);
    }
  }

}