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
    const result = Reflect.set(target, name, value, receiver)
    if (name === 'title') {
      document.title = value
      document.querySelector('head > meta[property="og:title"]').setAttribute('content', value)
      windowEvent('page')
    } else if (name === 'description') {
      document.querySelector('head > meta[name="description"]').setAttribute('content', value)
      document.querySelector('head > meta[property="og:description"]').setAttribute('content', value)
    } else if (name === 'locale') {
      document.querySelector('html').setAttribute('lang', value)
      document.querySelector('head > meta[property="og:locale"]').setAttribute('content', value)
    } else if (name === 'image') {
      document.querySelector('head > meta[property="og:image"]').setAttribute('content', value)
    } else if (name === 'canonical') {
      canonical = (path.indexOf('//') === -1) ? router.base + value : value
      document.querySelector('head > link[rel="canonical"]').setAttribute('href', canonical)
    }
    client.update()
    return result
  },
}

const proxy = new Proxy(page, pageProxyHandler)

export default proxy
