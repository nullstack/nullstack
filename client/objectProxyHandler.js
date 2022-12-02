import client from './client'

const objectProxyHandler = {
  set(target, name, value) {
    if (isProxyable(name, value)) {
      target[name] = new Proxy(value, this)
    } else {
      target[name] = value
    }
    if (!name.startsWith('_')) {
      client.update()
    }
    return true
  },
  get(target, name, receiver) {
    if (name === '_isProxy') return true
    return Reflect.get(target, name, receiver)
  },
}

function isProxyable(name, value) {
  if (name.startsWith('_')) return false
  const constructor = value?.constructor
  if (!constructor) return false
  if (value._isProxy) return false
  return constructor === Array || constructor === Object
}

export function generateObjectProxy(name, value) {
  if (isProxyable(name, value)) {
    if (typeof value === 'object') {
      for (const key of Object.keys(value)) {
        value[key] = generateObjectProxy(key, value[key])
      }
    }
    return new Proxy(value, objectProxyHandler)
  }
  return value
}

export default objectProxyHandler
