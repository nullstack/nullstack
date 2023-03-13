import element from '../shared/element'
import fragment from '../shared/fragment'
import { register } from './registry'
import Nullstack from './index'

const $runtime = {
  element,
  fragment,
  register
}

if (module.hot) {
  $runtime.accept = function accept(target, _file, _dependencies, declarations) {
    target.hot.accept();
    for (const declaration of declarations) {
      declaration.klass.__hashes = declaration.hashes
    }
  }

  $runtime.restart = function restart(target, path, klass) {
    target.hot.accept()
    target.hot.accept(path, () => {
      Nullstack.start(klass)
    })
  }
}

export default $runtime