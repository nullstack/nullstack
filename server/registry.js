const registry = {}
export default registry
import reqres from "./reqres"
import { generateContext } from "./context"
import Nullstack from '.'
import { load } from "./lazy"

export function register(klass, functionName) {
  if (functionName) {
    registry[`${klass.hash}.${functionName}`] = klass[functionName]
  } else {
    registry[klass.hash] = klass
    bindStaticProps(klass)
  }
}

function bindStaticProps(klass) {
  let parent = klass
  while (parent !== Nullstack) {
    const props = Object.getOwnPropertyNames(parent)
    for (const prop of props) {
      const underscored = prop.startsWith('_')
      if (typeof klass[prop] === 'function') {
        if (!underscored && !registry[`${parent.hash}.${prop}`]) {
          return
        }
        const propName = `__NULLSTACK_${prop}`
        if (!klass[propName]) {
          klass[propName] = klass[prop]
        }
        async function _invoke(...args) {
          if (underscored) {
            return klass[propName].call(klass, ...args)
          }
          const params = args[0] || {}
          const { request, response } = reqres
          const subcontext = generateContext({ request, response, ...params })
          await load(klass.hash)
          return klass[propName].call(klass, subcontext)
        }
        if (module.hot) {
          _invoke.hash = klass[prop].hash
        }
        klass[prop] = _invoke
        klass.prototype[prop] = _invoke
      }
    }
    parent = Object.getPrototypeOf(parent)
  }
}