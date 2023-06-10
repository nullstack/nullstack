import { AsyncLocalStorage } from 'async_hooks'

const internalContext = {}

const contextProxyHandler = {
  set(target, name, value, receiver) {
    const currentContext = asyncLocalStorage.getStore()
    if (currentContext) {
      currentContext[name] = value
      return true
    } else {
      return Reflect.set(target, name, value, receiver)
    }
  },
  get(target, name, receiver) {
    const currentContext = asyncLocalStorage.getStore()
    if (currentContext) {
      return currentContext[name]
    } else {
      return Reflect.get(target, name, receiver)
    }
  }
}

const context = new Proxy(internalContext, contextProxyHandler)

const asyncLocalStorage = new AsyncLocalStorage()

export function generateContext(temporary) {
  if(temporary) {
    Object.assign(context, temporary)
  }
  return context
}

export function generateCurrentContext(temporary, callback) {
  const currentContext = {...internalContext, ...temporary}
  asyncLocalStorage.run(currentContext, () => {
    callback(currentContext);
  });
}

export function getCurrentContext(temporary) {
  const currentContext = asyncLocalStorage.getStore()
  if (!currentContext) {
    return generateContext()
  }
  if(temporary) {
    Object.assign(currentContext, temporary)
  }
  return currentContext
}

export default context