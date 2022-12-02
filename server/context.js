const context = {}

const contextProxyHandler = {
  set(target, name, value, receiver) {
    context[name] = value
    return Reflect.set(target, name, value, receiver)
  },
}

export function generateContext(temporary) {
  return new Proxy({ ...context, ...temporary }, contextProxyHandler)
}

export default context
