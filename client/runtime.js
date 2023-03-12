import element from '../shared/element'
import fragment from '../shared/fragment'
import invoke from './invoke'
import context from './context'
import windowEvent from './windowEvent'
import client from './client'

const $runtime = {
  element,
  fragment,
  invoke,
}

if (module.hot) {
  $runtime.dependencies = new Map()

  $runtime.accept = function accept(target, file, dependencies, declarations) {
    target.hot.accept()
    const old = $runtime.dependencies.get(file)
    if (old) {
      if (old.length !== dependencies.length) {
        return window.location.reload()
      }
      for (const index in old) {
        if (old[index] !== dependencies[index]) {
          return window.location.reload()
        }
      }
    }
    $runtime.dependencies.set(file, dependencies)
    if (client.skipHotReplacement) {
      return window.location.reload()
    }
    for (const declaration of declarations) {
      for (const key in context.instances) {
        const instance = context.instances[key]
        if (instance.constructor.hash === declaration.klass.hash) {
          Object.setPrototypeOf(instance, declaration.klass.prototype)
          if (instance.__initiator !== undefined && instance.__initiator !== declaration.initiate) {
            instance.initiate()
          }
          instance.__initiator = declaration.initiate
        }
      }
    }
    windowEvent('environment')
    client.update()
  }

  $runtime.restart = function restart(target, path) {
    target.hot.accept()
    target.hot.accept(path, () => {
      window.location.reload()
    })
  }
}

export default $runtime