import extractLocation from '../shared/extractLocation';
import { generateBase } from './project';
export default class Router {

  previous = null

  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  _redirect(target) {
    if (!this.response.headersSent) {
      const { url } = extractLocation(target);
      this.response.redirect(url);
    }
  }

  get url() {
    return extractLocation(this.request.originalUrl).url;
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return extractLocation(this.request.path).path;
  }

  set path(target) {
    const { search } = extractLocation(this.request.originalUrl);
    if (search) {
      this._redirect(target + '?' + search);
    } else {
      this._redirect(target);
    }
  }

  get base() {
    return generateBase()
  }

}
