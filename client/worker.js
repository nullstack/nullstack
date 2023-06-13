import client from './client'
import environment from './environment'
import router from './router'
import state from './state'

const worker = { ...state.worker }
delete state.worker

const emptyQueue = Object.freeze([])

const queuesProxyHandler = {
  set(target, name, value) {
    target[name] = value
    client.update()
    return true
  },
  get(target, name) {
    return target[name] || emptyQueue
  },
}

worker.queues = new Proxy({}, queuesProxyHandler)

const workerProxyHandler = {
  set(target, name, value) {
    if (target[name] !== value) {
      target[name] = value
      client.update()
    }
    return true
  },
}

const proxy = new Proxy(worker, workerProxyHandler)

async function register() {
  if (!environment.production) return
  const request = `/service-worker.js`
  try {
    proxy.registration = await navigator.serviceWorker.register(request, { scope: '/' })
  } catch (error) {
    console.error(error)
  }
}

async function unregister() {
  if (!environment.development) return
  const registrations = await navigator.serviceWorker.getRegistrations()
  for (let registration of registrations) {
    window.location.reload()
    console.log("SW FOUND", { registration })
    registration.unregister();
  }
}

if (worker.enabled) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('beforeinstallprompt', async function (event) {
      event.preventDefault()
      proxy.installation = event
      unregister()
    })
    register()
  }
}

window.addEventListener('online', () => {
  proxy.online = true
  if (environment.mode === 'ssg') {
    router._update(router.url)
  } else {
    proxy.responsive = true
  }
})

window.addEventListener('offline', () => {
  proxy.online = false
})

export default proxy
