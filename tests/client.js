import Nullstack from 'nullstack'

import Application from './src/Application'
import CatchError from './src/CatchError.njs'
import vueable from './src/plugins/vueable'

Nullstack.use(vueable)

const context = Nullstack.start(Application)

context.start = function () {
  context.startValue = true
  setTimeout(() => (context.startTimedValue = true), 1000)
}

context.catch = async function (error) {
  CatchError.logError({ message: error.message })
  console.error(error)
}

export default context
