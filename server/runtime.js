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
  $runtime.accept = function accept(target) {
    target.hot.accept();
    require('fs').unlink(require('path').join(__dirname, '.compiling'), () => { })
  }

  $runtime.restart = function restart(target, path, klass) {
    target.hot.accept()
    target.hot.accept(path, () => {
      Nullstack.start(klass)
    })
  }
}

export default $runtime