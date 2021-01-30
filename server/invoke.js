import {generateContext} from './context';

export default function invoke(name) {
  return async function _invoke(params = {}) {
    const request = this._request();
    const response = this._response();
    const context = generateContext({request, response, ...params});
    return await this.constructor[name](context);
  }
}