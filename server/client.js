/* eslint-disable prefer-rest-params */
export function generateContext(context) {
  const contextProxyHandler = {
    set(target, name, value) {
      context[name] = value
      return Reflect.set(...arguments)
    },
    get(target, name) {
      return target[name] === undefined ? context[name] : target[name]
    },
  }
  return function (temporary) {
    return new Proxy({ ...context, ...temporary }, contextProxyHandler)
  }
}
