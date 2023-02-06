import client from './client'
import context, { generateContext } from './context'
import { generateObjectProxy } from './objectProxyHandler'

export const instanceProxies = new WeakMap()

const instanceProxyHandler = {
  get(target, name, receiver) {
    if (name === '_isProxy') return true
    if (target.constructor[name]?.name === '_invoke') return target.constructor[name].bind(target.constructor)
    if (typeof target[name] === 'function' && name !== 'constructor') {
      const proxy = instanceProxies.get(target)
      if (name.startsWith('_')) {
        return target[name].bind(proxy)
      }
      const { [name]: named } = {
        [name]: (args) => {
          const scopedContext = generateContext({ ...target._attributes, ...args })
          let result
          try {
            result = target[name].call(proxy, scopedContext)
          } catch (error) {
            if (context.catch) {
              context.catch(error)
            } else {
              throw error
            }
            return null
          }
          if (result instanceof Promise) {
            return new Promise((resolve, reject) => {
              result.then(resolve).catch((error) => {
                context.catch ? context.catch(error) : reject(error)
              })
            })
          }
          return result
        },
      }
      return named
    }
    return Reflect.get(target, name, receiver)
  },
  set(target, name, value) {
    if (!name.startsWith('_')) {
      target[name] = generateObjectProxy(name, value)
      client.update()
    } else {
      target[name] = value
    }
    return true
  },
}

export default instanceProxyHandler
