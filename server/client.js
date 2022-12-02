export function generateContext(context) {
  const contextProxyHandler = {
    set(target, name, value, receiver) {
      context[name] = value
      return Reflect.set(target, name, value, receiver)
    },
    get(target, name) {
      return target[name] === undefined ? context[name] : target[name]
    },
  }
  return function (temporary) {
    return new Proxy({ ...context, ...temporary }, contextProxyHandler)
  }
}
