import element from '../shared/element'
import fragment from '../shared/fragment'
import registry, { register } from './registry'
import reqres from "./reqres"
import { generateContext } from "./context"
import Nullstack from './index'

const $runtime = {
  element,
  fragment,
  register
}

if (module.hot) {
  $runtime.accept = function accept(target, ...klasses) {
    target.hot.accept();
    for (const klass in klasses) {
      let parent = klass
      while (parent.name !== 'Nullstack') {
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
            function _invoke(...args) {
              if (underscored) {
                return klass[propName].call(klass, ...args)
              }
              const params = args[0] || {}
              const { request, response } = reqres
              const subcontext = generateContext({ request, response, ...params })
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
  }

  $runtime.restart = function restart(target, path) {
    target.hot.accept()
    target.hot.accept(path, () => {
      Nullstack.start(klass)
    })
  }
}

export default $runtime