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
  $runtime.accept = function accept(target, ...klasses) {
    target.hot.accept();
    for (const klass of klasses) {
      for (const key in context.instances) {
        const instance = context.instances[key]
        if (instance.constructor.hash === klass.hash) {
          Object.setPrototypeOf(instance, klass.prototype)
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