import {generateContext} from './context';

export default function contextualize(method) {
  return function _contextualize(args) {
    const context = generateContext({...this._context, ...args, self: this._self});
    return method.call(this, context);
  }
}