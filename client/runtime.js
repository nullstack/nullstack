import element from '../shared/element'
import fragment from '../shared/fragment'
import invoke from './invoke'
import context from './context'
import windowEvent from './windowEvent'
import client from './client'
import lazy from './lazy'

const $runtime = {
  element,
  fragment,
  invoke,
  lazy
}

if (module.hot) {
  $runtime.dependencies = new Map()

  $runtime.accept = function accept(target, file, dependencies, declarations) {
    target.hot.accept()
    let initiateQueue = []
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
      let oldConstructor
      for (const key in context.instances) {
        const instance = context.instances[key]
        if (instance.constructor.hash === declaration.klass.hash) {
          oldConstructor = instance.constructor
          Object.setPrototypeOf(instance, declaration.klass.prototype)
          if (oldConstructor.__hashes !== undefined) {
            for (const dep of declaration.initiate) {
              if (oldConstructor.__hashes[dep] !== declaration.hashes[dep]) {
                initiateQueue.push(instance)
                break
              }
            }
          }
        }
      }
      client.klasses[declaration.klass.hash] = declaration.klass
      declaration.klass.__hashes = declaration.hashes
    }
    windowEvent('environment')
    for (const instance of initiateQueue) {
      instance.initiate()
    }
    client.update()
  }
}

$runtime.restart = function restart(target, path) {
  target.hot.accept()
  target.hot.accept(path, () => {
    window.location.reload()
  })
}

export default $runtime