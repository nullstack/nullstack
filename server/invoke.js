import {generateContext} from './context';

export default function invoke(name, klass) {
  return async function _invoke(params = {}) {
    const request = this._request();
    const response = this._response();
    const context = generateContext({request, response, ...params});
    return await klass[name].call(klass, context);
  }
}