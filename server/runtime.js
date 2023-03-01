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
  $runtime.accept = function accept(target, ...klasses) {
    target.hot.accept();
  }

  $runtime.restart = function restart(target, path) {
    target.hot.accept()
    target.hot.accept(path, () => {
      Nullstack.start(klass)
    })
  }
}

export default $runtime