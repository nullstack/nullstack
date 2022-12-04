import Nullstack from 'nullstack'

import Application from './src/Application'
import vueable from './src/plugins/vueable'

Nullstack.use(vueable)

const context = Nullstack.start(Application)

context.start = function () {
  context.startValue = true
  setTimeout(() => (context.startTimedValue = true), 1000)
}

export default context
