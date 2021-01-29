export default function contextualize(method) {
  return function _contextualize(args) {
    const context = this._scope.generateContext({...this._attributes, ...args, self: this._self});
    return method.call(this, context);
  }
}