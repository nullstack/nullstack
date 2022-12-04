import client from './client'
import state from './state'
import windowEvent from './windowEvent'

const page = {
  ...state.page,
  event: 'nullstack.page',
}

delete state.page

const pageProxyHandler = {
  set(target, name, value, receiver) {
    if (name === 'title') {
      document.title = value
    }
    const result = Reflect.set(target, name, value, receiver)
    if (name === 'title') {
      windowEvent('page')
    }
    client.update()
    return result
  },
}

const proxy = new Proxy(page, pageProxyHandler)

export default proxy
