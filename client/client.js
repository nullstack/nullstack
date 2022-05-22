import generateTree from '../shared/generateTree'
import { loadPlugins } from '../shared/plugins'
import context, { generateContext } from './context'
import rerender from './rerender'
import router from './router'

const client = {}

client.initialized = false
client.initializer = null
client.instances = {}
context.instances = client.instances
client.initiationQueue = []
client.renewalQueue = []
client.hydrationQueue = []
client.realHydrationQueue = []
client.virtualDom = {}
client.selector = null
client.events = {}
client.generateContext = generateContext
client.renderQueue = null
client.currentBody = {}
client.nextBody = {}
client.currentHead = []
client.nextHead = []
client.head = document.head
client.body = document.body

client.update = async function update() {
  if (client.initialized) {
    clearInterval(client.renderQueue)
    client.renderQueue = setTimeout(async () => {
      const scope = client
      scope.context = context
      scope.plugins = loadPlugins(scope)
      client.initialized = false
      client.renewalQueue = []
      client.nextVirtualDom = await generateTree(client.initializer(), scope)
      rerender()
      client.processLifecycleQueues()
    }, 16)
  }
}

client.processLifecycleQueues = async function processLifecycleQueues() {
  if (!client.initialized) {
    client.initialized = true
  }
  let shouldUpdate = false
  while (client.initiationQueue.length) {
    const instance = client.initiationQueue.shift()
    instance.initiate && await instance.initiate()
    instance._self.initiated = true
    instance.launch && instance.launch()
    shouldUpdate = true
  }
  shouldUpdate && client.update()
  shouldUpdate = false
  while (client.realHydrationQueue.length) {
    shouldUpdate = true
    const instance = client.realHydrationQueue.shift()
    instance.hydrate && await instance.hydrate()
    instance._self.hydrated = true
  }
  shouldUpdate && client.update()
  shouldUpdate = false
  while (client.hydrationQueue.length) {
    shouldUpdate = true
    const instance = client.hydrationQueue.shift()
    client.realHydrationQueue.push(instance)
  }
  shouldUpdate && client.update()
  for (const key in client.instances) {
    const instance = client.instances[key]
    if (!client.renewalQueue.includes(instance) && !instance._self.terminated) {
      instance.terminate && await instance.terminate()
      if (instance._self.persistent) {
        instance._self.terminated = true
        instance._self.element = null
      } else {
        delete client.instances[key]
      }
    }
  }
  router._changed = false
}

export default client