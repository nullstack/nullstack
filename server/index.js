import './dotenv'
import { normalize } from 'path'

import element from '../shared/element'
import getProxyableMethods from '../shared/getProxyableMethods'
import { useServerPlugins } from '../shared/plugins'
import context from './context'
import environment from './environment'
import generator from './generator'
import instanceProxyHandler from './instanceProxyHandler'
import project from './project'
import secrets from './secrets'
import server from './server'
import settings from './settings'
import worker from './worker'
import fetch from 'node-fetch'

globalThis.window = {}

if (!global.fetch) {
  global.fetch = fetch
}

if (!global.location) {
  global.location = {
    href: '/',
  }
}

context.server = server
context.project = project
context.environment = environment
context.settings = settings
context.secrets = secrets
context.worker = worker

server.less = normalize(__filename) !== normalize(process.argv[1])

if (environment.development) {
  globalThis.$nullstack = context
}

class Nullstack {

  static use = useServerPlugins

  static start(Starter) {
    if (this === Nullstack) {
      generator.starter = () => element(Starter)
      setTimeout(server.start, 0)
      return context
    }
  }

  prerendered = true
  initiated = false
  hydrated = false
  terminated = false
  key = null

  constructor() {
    const methods = getProxyableMethods(this)
    const proxy = new Proxy(this, instanceProxyHandler)
    for (const method of methods) {
      this[method] = this[method].bind(proxy)
    }
    return proxy
  }

  toJSON() {
    const serialized = {}
    for (const name of Object.getOwnPropertyNames(this)) {
      if (name === 'prerendered') continue
      if (name === 'initiated') continue
      if (name === 'hydrated') continue
      if (name === 'terminated') continue
      if (name === 'key') continue
      if (name === '_attributes') continue
      if (name === '_scope') continue
      if (typeof this[name] === 'function') continue
      serialized[name] = this[name]
    }
    return serialized
  }

  render() {
    return false
  }

}

export default Nullstack